import Link from 'next/link';
export default function NotFound() {
  return (
    <div style={{minHeight:'70vh',display:'grid',placeItems:'center',textAlign:'center',padding:40}}>
      <div><p className="eyebrow" style={{justifyContent:'center'}}>404</p><h1>That page isn’t here.</h1>
      <p className="lead" style={{margin:'0 auto 24px'}}>The link may be outdated, or the page may have moved.</p>
      <Link href="/" className="btn btn-primary">Back to home →</Link></div>
    </div>
  );
}
