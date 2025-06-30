export default function DemoComponent() {
  return (
    <div className="container">
      <p>This is a <span>test</span> component</p>
      <>
        <div>Fragment content</div>
        <div>Fragment content 2</div>
        <div>
          <p>111</p>
        </div>
      </>
    </div>
  )
}