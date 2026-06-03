export default function CourseCard({ course }) {
  return (
    <div style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
      <h3>{course.name}</h3>
      <p>{course.description}</p>
      <p style={{ fontWeight: 'bold' }}>₹{course.price}</p>
      <a href="/dashboard" style={{ display: 'inline-block', marginTop: 8, padding: '8px 16px', background: '#111', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>
        Get Started
      </a>
    </div>
  );
}
