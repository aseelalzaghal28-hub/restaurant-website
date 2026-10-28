const dishes = [
  {n:'حمّص بالطحينة', d:'حمّص مهروس مع طحينة وزيت زيتون وليمون', p:12, c:'مقبلات'},
  {n:'متبّل باذنجان', d:'باذنجان مشوي مع طحينة ورمان', p:14, c:'مقبلات'},
  {n:'فتّوش', d:'خضار طازجة مع خبز مقرمش ودبس رمان', p:16, c:'مقبلات'},
  {n:'ورق عنب', d:'ورق عنب محشي بالأرز وزيت الزيتون', p:18, c:'مقبلات'},
  {n:'مسخّن', d:'دجاج مع بصل وسماق على خبز طابون', p:42, c:'وجبات رئيسية'},
  {n:'مقلوبة لحم', d:'أرز مع لحم وباذنجان وقرنبيط، تُقلب أمامك', p:48, c:'وجبات رئيسية'},
  {n:'منسف', d:'لحم بلدي مع أرز ولبن جميد وصنوبر', p:55, c:'وجبات رئيسية'},
  {n:'مشاوي مشكلة', d:'كباب وشيش طاووق وريش مع خضار مشوية', p:60, c:'وجبات رئيسية'},
  {n:'كنافة نابلسية', d:'جبنة نابلسية وقطر وفستق حلبي', p:20, c:'حلويات'},
  {n:'قطايف بالقشطة', d:'قطايف مقلية محشوة بالقشطة والعسل', p:18, c:'حلويات'},
  {n:'أم علي', d:'عجينة مخبوزة بالحليب والمكسرات', p:19, c:'حلويات'}
];
const cats = ['الكل','مقبلات','وجبات رئيسية','حلويات'];
const colors = {'مقبلات':'#5e7a3a','وجبات رئيسية':'#a3311f','حلويات':'#b07a24'};
const fEl = document.getElementById('filters'), list = document.getElementById('menuList');
let active = 'الكل';

function render(){
  const items = dishes.filter(x => active==='الكل' || x.c===active);
  list.innerHTML = '';
  if(!items.length){ list.innerHTML = '<li class="empty">لا توجد أطباق في هذا التصنيف.</li>'; return; }
  items.forEach(x=>{
    const li = document.createElement('li'); li.className='dish';
    const m = document.createElement('div'); m.className='mark'; m.style.background=colors[x.c]; m.textContent=x.n[0]; m.setAttribute('aria-hidden','true');
    const t = document.createElement('div');
    const h = document.createElement('h3'); h.textContent=x.n;
    const p = document.createElement('p'); p.textContent=x.d;
    t.append(h,p);
    const pr = document.createElement('span'); pr.className='price'; pr.textContent = x.p + ' ₪';
    li.append(m,t,pr); list.append(li);
  });
}
cats.forEach(c=>{
  const b = document.createElement('button'); b.type='button'; b.textContent=c;
  b.setAttribute('aria-pressed', c===active);
  b.onclick = ()=>{ active=c; [...fEl.children].forEach(k=>k.setAttribute('aria-pressed', k===b)); render(); };
  fEl.append(b);
});
render();

// Booking form
const form = document.getElementById('bookForm'), ok = document.getElementById('ok');
const guests = document.getElementById('guests');
for(let i=1;i<=10;i++){ const o=document.createElement('option'); o.value=i; o.textContent = i===1?'شخص واحد':(i===2?'شخصان':i+' أشخاص'); guests.append(o); }
const dateEl = document.getElementById('date');
const today = new Date(); today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
dateEl.min = today.toISOString().slice(0,10);

const rules = {
  name: v => v.trim().split(/\s+/).filter(Boolean).length>=2 && v.trim().length>=5 ? '' : 'اكتب اسمك الأول واسم العائلة.',
  phone: v => /^(\+?97[02])?0?5[0-9]{8}$/.test(v.replace(/[\s-]/g,'')) ? '' : 'اكتب رقم جوال صحيح، مثل 0591234567.',
  date: v => !v ? 'اختر تاريخ الحجز.' : (v < dateEl.min ? 'لا يمكن الحجز في تاريخ سابق.' : ''),
  time: v => !v ? 'اختر وقت الحجز.' : ((v<'12:00'||v>'22:30') ? 'الحجز متاح من 12:00 حتى 22:30.' : ''),
  guests: v => v ? '' : 'اختر عدد الأشخاص.'
};
function check(k){
  const el = form.elements[k], msg = rules[k](el.value);
  document.getElementById('e-'+k).textContent = msg;
  el.setAttribute('aria-invalid', !!msg);
  return !msg;
}
Object.keys(rules).forEach(k=>{
  form.elements[k].addEventListener('blur',()=>check(k));
  form.elements[k].addEventListener('input',()=>{ if(form.elements[k].getAttribute('aria-invalid')==='true') check(k); });
});
form.addEventListener('submit',e=>{
  e.preventDefault();
  const results = Object.keys(rules).map(check);
  if(results.includes(false)){ form.querySelector('[aria-invalid="true"]').focus(); return; }
  const f = form.elements;
  const d = new Date(f.date.value+'T00:00').toLocaleDateString('ar',{weekday:'long',day:'numeric',month:'long'});
  ok.textContent = `شكرًا ${f.name.value.trim().split(/\s+/)[0]}، تم استلام طلب حجزك لـ ${f.guests.value} ${+f.guests.value>10?'':'أشخاص'} يوم ${d} الساعة ${f.time.value}. سنتواصل معك على ${f.phone.value} للتأكيد.`;
  form.style.display='none'; ok.classList.add('show'); ok.focus();
});
