import Link from 'next/link';
import { AppHead } from '@/components/module-view';
import { Panel } from '@/components/ui';
export default function NewBook(){
  return <>
    <div className="breadcrumbs" style={{marginBottom:16}}><Link href="/portal/books">My books</Link><span>/</span><span>Add a book</span></div>
    <AppHead title="Add a book" subtitle="Only title is required. ISBN, ASIN and publication date are optional until they exist."/>
    <Panel title="Book details">
      <div className="form-grid">
        <div><label>Title *</label><input placeholder="Book title"/></div>
        <div><label>Subtitle</label><input placeholder="Optional subtitle"/></div>
        <div><label>Genre / categories</label><input placeholder="e.g. Literary fiction"/></div>
        <div><label>Language</label><select><option>English</option><option>French</option><option>Other</option></select></div>
        <div><label>Publication status</label><select><option>Unpublished / in progress</option><option>Scheduled</option><option>Published</option></select></div>
        <div><label>Publication date</label><input type="date"/></div>
        <div><label>ISBN-13</label><input placeholder="Leave blank if not assigned"/></div>
        <div><label>ASIN / retailer ID</label><input placeholder="Optional"/></div>
      </div>
      <div style={{marginTop:16}}><label>Synopsis / description</label><textarea placeholder="A short description of the book"/></div>
      <div style={{marginTop:16}}><label>Marketing goals & target audience</label><textarea placeholder="Who is this book for and what would you like to achieve?"/></div>
      <div className="row" style={{marginTop:20}}><button className="btn btn-primary btn-sm">Save book</button><Link href="/portal/books" className="btn btn-outline btn-sm">Cancel</Link></div>
      <div className="notice" style={{marginTop:20,fontSize:'.82rem'}}><strong>Why optional fields matter.</strong>&nbsp; Many authors are pre-publication. Forcing an ISBN or a publication date would block them from using the platform — so those fields are nullable by design.</div>
    </Panel>
  </>;
}
