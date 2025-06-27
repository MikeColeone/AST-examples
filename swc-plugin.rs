use swc_core::{
    common::{Span, DUMMY_SP},
    ecma::{
        ast::*,
        visit::{VisitMut, VisitMutWith},
    },
};
use std::time::Instant;

pub struct DomMakerVisitor {
    start_time: Option<Instant>, // 记录开始时间
}

impl DomMakerVisitor {
    pub fn new() -> Self {
        DomMakerVisitor { start_time: None }
    }
}

impl VisitMut for DomMakerVisitor {
    fn visit_mut_module(&mut self, module: &mut Module) {
        self.start_time = Some(Instant::now()); // 记录开始时间
        module.visit_mut_children_with(self);
        if let Some(start) = self.start_time {
            let duration = start.elapsed();
            println!("SWC JSXElement modify 耗时: {:?}", duration);
        }
    }

    fn visit_mut_jsx_element(&mut self, element: &mut JSXElement) {
        if let JSXElementName::Ident(ident) = &element.opening.name {
            if ident.sym.starts_with(char::is_alphabetic) {
                let opening = &mut element.opening;
                let closing = &element.closing;

                let start_line = opening.span.lo.line;
                let end_line = closing.as_ref().map_or(opening.span.hi.line, |c| c.span.hi.line);

                let has_start_line = opening.attrs.iter().any(|attr| {
                    matches!(attr, JSXAttrOrSpread::JSXAttr(attr) 
                        if attr.name.as_ident().is_some_and(|id| id.sym == "data-start-line"))
                });

                let has_end_line = opening.attrs.iter().any(|attr| {
                    matches!(attr, JSXAttrOrSpread::JSXAttr(attr) 
                        if attr.name.as_ident().is_some_and(|id| id.sym == "data-end-line"))
                });

                if !has_start_line {
                    opening.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
                        span: DUMMY_SP,
                        name: JSXAttrName::Ident(Ident::new("data-start-line".into(), DUMMY_SP)),
                        value: Some(JSXAttrValue::Lit(Lit::Str(Str {
                            span: DUMMY_SP,
                            value: start_line.to_string().into(),
                            raw: None,
                        }))),
                    }));
                }

                if !has_end_line {
                    opening.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
                        span: DUMMY_SP,
                        name: JSXAttrName::Ident(Ident::new("data-end-line".into(), DUMMY_SP)),
                        value: Some(JSXAttrValue::Lit(Lit::Str(Str {
                            span: DUMMY_SP,
                            value: end_line.to_string().into(),
                            raw: None,
                        }))),
                    }));
                }
            }
        }
        element.visit_mut_children_with(self);
    }
}