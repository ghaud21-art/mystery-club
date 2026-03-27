import { useState, useRef, useEffect } from "react";

// ── 스타일 설문 (10문항) ───────────────────────────
const SURVEY = [
  { q:"단서를 발견하면?", opts:[{l:"🔍 논리적으로 연결",s:"분석형"},{l:"⚡ 직감으로 범인 지목",s:"직관형"},{l:"🌸 팀원과 바로 공유",s:"감성형"},{l:"📐 노트에 체계 정리",s:"논리형"}] },
  { q:"맡고 싶은 역할은?", opts:[{l:"🔍 탐정 — 수사 리더",s:"분석형"},{l:"🎭 범인 — 연기로 속임",s:"연기형"},{l:"🌸 조연 — 분위기 메이커",s:"감성형"},{l:"📐 목격자 — 정보 활용",s:"논리형"}] },
  { q:"추리 방식은?", opts:[{l:"📐 증거 데이터 중심",s:"논리형"},{l:"🌸 표정·말투 관찰",s:"감성형"},{l:"🔍 여러 가설 검토",s:"분석형"},{l:"⚡ 직감을 믿는다",s:"직관형"}] },
  { q:"팀에서 내 역할은?", opts:[{l:"🔍 수사 방향 리더",s:"분석형"},{l:"🌸 분위기 메이커",s:"감성형"},{l:"📐 조용한 정보 수집",s:"논리형"},{l:"🎭 극적 반전 연출",s:"연기형"}] },
  { q:"게임 끝난 후?", opts:[{l:"🔍 트릭 구조 복기",s:"분석형"},{l:"🌸 캐릭터 감정 토론",s:"감성형"},{l:"📐 다음 전략 구상",s:"논리형"},{l:"🎭 인상 장면 재연",s:"연기형"}] },
  { q:"정보를 처리할 때 나는?", opts:[{l:"📐 도표나 메모로 정리",s:"논리형"},{l:"🔍 패턴과 연결고리 탐색",s:"분석형"},{l:"⚡ 머릿속 직관적 그림",s:"직관형"},{l:"🌸 팀원과 함께 정리",s:"감성형"}] },
  { q:"다른 플레이어와 대화할 때?", opts:[{l:"🌸 공감하며 감정을 읽는다",s:"감성형"},{l:"📐 팩트만 간결히 교환",s:"논리형"},{l:"🎭 역할에 완전히 몰입",s:"연기형"},{l:"🔍 정보 가치를 평가하며 듣는다",s:"분석형"}] },
  { q:"시간 압박이 올 때?", opts:[{l:"⚡ 직관으로 빠르게 판단",s:"직관형"},{l:"📐 우선순위 리스트 정리",s:"논리형"},{l:"🔍 가장 강력한 증거에 집중",s:"분석형"},{l:"🌸 팀원과 빠르게 합의",s:"감성형"}] },
  { q:"범인 역할을 맡았다면?", opts:[{l:"🎭 완벽한 연기로 의심 차단",s:"연기형"},{l:"📐 논리적 알리바이 설계",s:"논리형"},{l:"⚡ 즉흥 블러핑으로 혼선",s:"직관형"},{l:"🔍 다른 용의자에게 의심 유도",s:"분석형"}] },
  { q:"게임이 끝나고 가장 기억에 남는 건?", opts:[{l:"🔍 핵심 트릭의 구조",s:"분석형"},{l:"🌸 팀원들의 반응과 감정",s:"감성형"},{l:"🎭 내가 연기한 장면",s:"연기형"},{l:"⚡ 예상 못한 반전 순간",s:"직관형"}] },
];

const SM = {
  분석형:{icon:"🔍",color:"#92400E",bg:"#FEF3C7",desc:"증거를 논리적으로 연결해 결론을 도출합니다.",str:"단서 연결력",weak:"직관 판단 느림"},
  직관형:{icon:"⚡",color:"#6D28D9",bg:"#EDE9FE",desc:"첫인상과 분위기로 빠르게 판단합니다.",str:"빠른 판단력",weak:"논리 설명 부족"},
  감성형:{icon:"🌸",color:"#BE185D",bg:"#FCE7F3",desc:"캐릭터에 몰입하고 팀 분위기를 살립니다.",str:"팀 시너지",weak:"객관 판단 어려움"},
  논리형:{icon:"📐",color:"#1D4ED8",bg:"#DBEAFE",desc:"정보를 체계적으로 정리하고 구조화합니다.",str:"정보 정리력",weak:"유연성 부족"},
  연기형:{icon:"🎭",color:"#059669",bg:"#D1FAE5",desc:"완벽한 연기력으로 상황을 주도합니다.",str:"블러핑·연기력",weak:"논리 추리 약함"},
};

const CS = {
  "분석형-분석형":70,"분석형-직관형":90,"분석형-감성형":82,
  "분석형-논리형":75,"분석형-연기형":88,"직관형-감성형":88,"직관형-논리형":78,"직관형-연기형":85,
  "감성형-논리형":80,"감성형-연기형":92,"논리형-연기형":84,"직관형-직관형":65,
  "감성형-감성형":68,"논리형-논리형":62,"연기형-연기형":60,
};
const compat=(a,b)=>CS[`${a}-${b}`]||CS[`${b}-${a}`]||70;
const cLabel=s=>s>=90?{l:"환상의 콤비 ✨",c:"#059669"}:s>=80?{l:"좋은 호흡 👍",c:"#2563EB"}:s>=70?{l:"무난한 팀워크",c:"#92400E"}:{l:"도전적 조합 🔥",c:"#DC2626"};

// ── 샘플 데이터 ───────────────────────────────────
const INIT_MB = [
  {id:1,name:"zsq123",av:"🕵️",role:"admin",style:"분석형",style2:null,pw:"ac1130",friends:[]},
];

const INIT_GR=[];

const SCENS=[];

const INIT_RC=[];

const INIT_SC=[];

const NAV=[
  {id:"dash",ic:"🗂",l:"대시보드"},{id:"my",ic:"👤",l:"마이페이지"},
  {id:"fri",ic:"🤝",l:"친구&궁합"},{id:"grp",ic:"🏠",l:"모임 관리"},
  {id:"all",ic:"📋",l:"전체 기록"},{id:"sc",ic:"📚",l:"시나리오 DB"},
  {id:"sch",ic:"📅",l:"일정·모집"},{id:"rec",ic:"🔮",l:"AI 추천"},
  {id:"hof",ic:"🏆",l:"명예의 전당"},
];

const T={bg:"#F7F3ED",paper:"#FFFDF9",card:"#FFFFFF",border:"#E5D9C8",
  text:"#1C1612",sub:"#6B5E52",muted:"#A8978A",gold:"#B45309",goldL:"#FEF3C7",
  red:"#B91C1C",green:"#15803D",sh:"0 2px 12px rgba(92,60,24,.08)"};
const inp={width:"100%",padding:"10px 14px",background:"#FFFDF9",border:"1.5px solid #E5D9C8",borderRadius:8,color:"#1C1612",fontSize:13,fontFamily:"inherit",boxSizing:"border-box"};
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#F7F3ED;font-family:'Noto Sans KR',sans-serif}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5D9C8;border-radius:2px}
.hov{transition:all .16s;cursor:pointer}.hov:hover{transform:translateY(-1px);box-shadow:0 4px 18px rgba(92,60,24,.13)}
.btn{cursor:pointer;border:none;transition:all .15s;font-family:inherit}.btn:hover{filter:brightness(.94)}
.fade{animation:fu .25s ease}
@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.spoiler{filter:blur(5px);cursor:pointer;transition:filter .3s}.spoiler:hover{filter:none}
input,textarea,select{outline:none;font-family:inherit;box-sizing:border-box;max-width:100%;display:block}
.login-wrap{min-height:100vh;background:#F7F3ED;display:flex;align-items:center;justify-content:center;padding:20px}
.login-card{width:360px;background:#FFFFFF;border-radius:20px;padding:40px 36px;border:1px solid #E5D9C8;box-shadow:0 8px 40px rgba(92,60,24,.14);overflow:hidden}
.signup-card{width:460px;background:#FFFFFF;border-radius:20px;padding:36px 36px;border:1px solid #E5D9C8;box-shadow:0 8px 40px rgba(92,60,24,.14);overflow:hidden}
.modal-body{padding:20px 22px}
.form-inner{width:100%;overflow:hidden}
@media(max-width:500px){
  .login-card{width:100%;padding:28px 20px}
  .signup-card{width:100%;padding:28px 20px}
}
`;

// ── 헬퍼 컴포넌트 ─────────────────────────────────
const Pill=({ok,children})=>(
  <span style={{padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,
    background:ok?"#DCFCE7":"#FEE2E2",color:ok?T.green:T.red,
    border:`1px solid ${ok?"#BBF7D0":"#FECACA"}`}}>{children}</span>
);
const GBtn=({onClick,children,full,sm,disabled})=>(
  <button className="btn" onClick={onClick} disabled={disabled}
    style={{padding:sm?"5px 11px":full?"11px":"8px 18px",background:disabled?"#E5D9C8":T.gold,
      color:disabled?T.muted:"#fff",borderRadius:8,fontWeight:700,fontSize:sm?12:13,
      width:full?"100%":"auto",opacity:disabled?.6:1}}>{children}</button>
);
const OBtn=({onClick,children,sm,red})=>(
  <button className="btn" onClick={onClick}
    style={{padding:sm?"5px 11px":"7px 15px",background:"transparent",
      color:red?T.red:T.sub,borderRadius:8,fontSize:sm?12:13,
      border:`1.5px solid ${red?"#FECACA":T.border}`}}>{children}</button>
);
const Fld=({label,children,flex})=>(
  <div style={flex?{flex}:{}}>
    <label style={{fontSize:11,fontWeight:700,color:T.sub,display:"block",marginBottom:5}}>{label}</label>
    {children}
  </div>
);
const Sec=({title,children})=>(
  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20,boxShadow:T.sh}}>
    <div style={{fontSize:12,fontWeight:700,color:T.gold,marginBottom:12}}>{title}</div>
    {children}
  </div>
);
const Em=({c})=><div style={{textAlign:"center",color:T.muted,padding:"22px 0",fontSize:13}}>{c}</div>;
const Hdr=({title,sub,action})=>(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}>
    <div>
      <h1 style={{fontFamily:"'Noto Sans KR',sans-serif",fontSize:24,fontWeight:700,color:T.text}}>{title}</h1>
      <p style={{fontSize:12,color:T.muted,marginTop:4}}>{sub}</p>
    </div>
    {action}
  </div>
);
const Modal=({title,onClose,children})=>(
  <div style={{position:"fixed",inset:0,background:"rgba(28,22,18,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}} onClick={onClose}>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,width:"100%",maxWidth:460,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 8px 40px rgba(92,60,24,.18)"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 22px",borderBottom:`1px solid ${T.border}`}}>
        <span style={{fontFamily:"'Noto Sans KR',sans-serif",fontSize:17,fontWeight:700,color:T.gold}}>{title}</span>
        <button className="btn" onClick={onClose} style={{color:T.muted,background:"none",fontSize:20}}>✕</button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);

// ── 페이지 타이틀 설정 ───────────────────────────
if(typeof document !== "undefined") document.title = "머더 미스터리 기록";

// ── calcStyles (이중 타입) ────────────────────────
function calcStyles(ans){
  const c={};
  ans.forEach((a,qi)=>{if(a!==null){const s=SURVEY[qi].opts[a].s;c[s]=(c[s]||0)+1;}});
  const sorted=Object.entries(c).sort((a,b)=>b[1]-a[1]);
  return{style:sorted[0]?.[0]||"분석형", style2:sorted[1]?.[0]||null};
}

// ── API 설정 ──────────────────────────────────────
const API_URL = "https://script.google.com/macros/s/AKfycbxgy0LVJuPx0rkioxzY-6pOgiPgiE_LlKpyduxgGLe74wC0bsaWvXJsQEkdwBWbR5Pp/exec"; // ← 배포 후 교체!

async function apiGet(action, params={}) {
  try {
    const url = new URL(API_URL);
    url.searchParams.set("action", action);
    Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));
    const res = await fetch(url.toString(), {redirect:"follow"});
    const text = await res.text();
    const json = JSON.parse(text);
    if(!json.ok) throw new Error(json.error);
    return json.data;
  } catch(e) { console.error("❌ API GET 오류:", action, e.message); throw e; }
}

async function apiPost(action, data={}, id=null) {
  try {
    // 객체/배열은 JSON 문자열로 직렬화
    const clean = {};
    Object.entries(data).forEach(([k,v])=>{
      if(v===undefined||v===null) return;
      clean[k] = (typeof v==="object") ? JSON.stringify(v) : v;
    });
    const url = new URL(API_URL);
    url.searchParams.set("action", action);
    url.searchParams.set("data", JSON.stringify(clean));
    if(id !== null) url.searchParams.set("id", String(id));
    console.log("📤 API 요청:", action, url.toString().slice(0,120)+"...");
    const res = await fetch(url.toString(), {redirect:"follow"});
    const text = await res.text();
    console.log("📥 API 응답:", text.slice(0,200));
    const json = JSON.parse(text);
    if(!json.ok) throw new Error(json.error);
    return json.data;
  } catch(e) { console.error("❌ API 오류:", action, e.message); throw e; }
}

// ── ROOT ──────────────────────────────────────────
export default function App(){
  const [auth,setAuth]=useState("login");
  const [me,setMe]=useState(null);
  const [page,setPage]=useState("dash");
  const [mbs,setMbs]=useState(INIT_MB);
  const [grps,setGrps]=useState(INIT_GR);
  const [recs,setRecs]=useState(INIT_RC);
  const [schs,setSchs]=useState(INIT_SC);
  const [scens,setScens]=useState(SCENS);
  const [modal,setModal]=useState(null);
  const [scLoading,setScLoading]=useState(false);
  const close=()=>setModal(null);
  const meD=mbs.find(m=>m.id===me?.id)||me;

  // 데이터 API 로드 (로그인 후)
  const loadScenarios = async () => {
    if(API_URL.includes("여기에")) return;
    setScLoading(true);
    try {
      const data = await apiGet("getScenarios");
      if(data && Array.isArray(data)){
        const parsed = data.map(s=>({
          ...s,
          ok: s.ok===true||s.ok==="TRUE"||s.ok==="true",
          tags: Array.isArray(s.tags)?s.tags:String(s.tags||"").split(",").map(t=>t.trim()).filter(Boolean),
          characters: typeof s.characters==="string"?JSON.parse(s.characters||"[]"):s.characters||[],
        }));
        setScens(parsed);
        console.log("✅ 시나리오 로드:", parsed.length, "개");
      }
    } catch(e) { console.error("❌ 시나리오 로드 실패:", e.message); }
    finally { setScLoading(false); }
  };
  const loadMembers = async () => {
    if(API_URL.includes("여기에")) return;
    try {
      const data = await apiGet("getMembers");
      if(data && Array.isArray(data) && data.length > 0){
        const parsed = data.map(m=>({
          ...m,
          friends: Array.isArray(m.friends)?m.friends:
            typeof m.friends==="string"?JSON.parse(m.friends||"[]"):[],
        }));
        setMbs(parsed);
        console.log("✅ 멤버 로드:", parsed.length, "명");
      }
    } catch(e) { console.error("❌ 멤버 로드 실패:", e.message); }
  };

  const addRec=r=>{setRecs(p=>[...p,{...r,id:Date.now()}]);close();};
  const updRec=r=>{setRecs(p=>p.map(x=>x.id===r.id?r:x));close();};
  const delRec=id=>setRecs(p=>p.filter(r=>r.id!==id));

  const addScen=async s=>{
    const newS={
      ...s,
      id:Date.now(),
      tags:Array.isArray(s.tags)?s.tags.join(","):s.tags,
      characters:JSON.stringify(s.characters||[]),
    };
    if(!API_URL.includes("여기에")){
      try {
        const saved=await apiPost("addScenario",newS);
        setScens(p=>[...p,{...saved,tags:Array.isArray(saved.tags)?saved.tags:String(saved.tags||"").split(",").filter(Boolean),characters:typeof saved.characters==="string"?JSON.parse(saved.characters||"[]"):saved.characters||[]}]);
        close(); return;
      } catch(e){ console.error("시나리오 저장 실패:",e); }
    }
    setScens(p=>[...p,{...s,id:newS.id}]);close();
  };
  const approveSc=async id=>{
    const sc=scens.find(s=>s.id===id);
    if(!sc)return;
    const updated={
      ...sc,ok:true,
      tags:Array.isArray(sc.tags)?sc.tags.join(","):sc.tags,
      characters:JSON.stringify(sc.characters||[]),
    };
    if(!API_URL.includes("여기에")){
      try { await apiPost("updateScenario",updated); }
      catch(e){ console.error("시나리오 승인 실패:",e); }
    }
    setScens(p=>p.map(s=>s.id===id?{...sc,ok:true}:s));
  };
  const rejectSc=async id=>{
    if(!API_URL.includes("여기에")){
      try { await apiPost("deleteScenario",{id},id); }
      catch(e){ console.error("시나리오 삭제 실패:",e); }
    }
    setScens(p=>p.filter(s=>s.id!==id));
  };

  const addSch=s=>{setSchs(p=>[...p,{...s,id:Date.now(),att:[me.id]}]);close();};
  const toggleAtt=id=>setSchs(p=>p.map(s=>{if(s.id!==id)return s;const h=s.att.includes(me.id);return{...s,att:h?s.att.filter(i=>i!==me.id):[...s.att,me.id]};}));
  const addFri=async fid=>{
    const updatedMe={...meD,friends:[...new Set([...(meD.friends||[]),fid])]};
    const updatedFri=mbs.find(m=>m.id===fid);
    const updatedFriObj=updatedFri?{...updatedFri,friends:[...new Set([...(updatedFri.friends||[]),meD.id])]}:null;
    setMbs(p=>p.map(m=>{
      if(m.id===meD.id)return updatedMe;
      if(m.id===fid&&updatedFriObj)return updatedFriObj;
      return m;
    }));
    setMe(prev=>({...prev,friends:[...new Set([...(prev.friends||[]),fid])]}));
    if(!API_URL.includes("여기에")){
      try{
        await apiPost("updateMember",{...updatedMe,friends:JSON.stringify(updatedMe.friends)});
        if(updatedFriObj) await apiPost("updateMember",{...updatedFriObj,friends:JSON.stringify(updatedFriObj.friends)});
      }catch(e){console.log("친구 업데이트 실패:",e);}
    }
  };
  const addGrp=g=>{setGrps(p=>[...p,{...g,id:Date.now(),owner:me.id}]);close();};

  if(!me){
    if(auth==="signup") return <Signup onDone={m=>{setMbs(p=>[...p,m]);setMe(m);setPage("dash");setAuth("login");}} onBack={()=>setAuth("login")} ids={mbs.map(m=>m.id)} />;
    return <Login mbs={mbs} onLogin={m=>{setMe(m);setPage("dash");loadScenarios();loadMembers();}} onSignup={()=>setAuth("signup")} onRefreshMbs={setMbs} />;
  }
  const pending=scens.filter(s=>!s.ok&&s.st==="pending");
  const props={me:meD,mbs,grps,recs,schs,scens,onNav:setPage,onAttend:toggleAtt};

  return (
    <>
      <style>{CSS}</style>
      <div style={{display:"flex",minHeight:"100vh",background:T.bg}}>
        <Sidebar page={page} setPage={setPage} me={meD} badge={meD?.role==="admin"?pending.length:0} onLogout={()=>setMe(null)} />
        <main style={{flex:1,overflowY:"auto",padding:"34px 38px"}}>
          {page==="dash"&&<Dash {...props} />}
          {page==="my"  &&<MyPage {...props} onAdd={()=>setModal({t:"aR"})} onEdit={r=>setModal({t:"eR",d:r})} onDel={delRec} />}
          {page==="fri" &&<Friends {...props} onAddFri={addFri} />}
          {page==="grp" &&<Groups {...props} onAdd={()=>setModal({t:"aG"})} />}
          {page==="all" &&<AllRecs {...props} onAdd={()=>setModal({t:"aR"})} />}
          {page==="sc"  &&<Scenarios {...props} recs={recs} mbs={mbs} onSubmit={()=>setModal({t:"aS"})} onApprove={approveSc} onReject={rejectSc} loading={scLoading} />}
          {page==="sch" &&<Schedule {...props} onAdd={()=>setModal({t:"aSch"})} />}
          {page==="rec" &&<Recommend {...props} />}
          {page==="hof" &&<HoF {...props} />}
        </main>
      </div>
      {modal?.t==="aR"  &&<Modal title="기록 추가" onClose={close}><RecForm scens={scens.filter(s=>s.ok)} me={meD} onSave={addRec} onClose={close} /></Modal>}
      {modal?.t==="eR"  &&<Modal title="기록 수정" onClose={close}><RecForm scens={scens.filter(s=>s.ok)} me={meD} init={modal.d} onSave={updRec} onClose={close} /></Modal>}
      {modal?.t==="aS"  &&<Modal title="시나리오 제보" onClose={close}><ScenForm me={meD} onSave={addScen} onClose={close} /></Modal>}
      {modal?.t==="aSch"&&<Modal title="일정 등록" onClose={close}><SchForm me={meD} scens={scens.filter(s=>s.ok)} grps={grps} onSave={addSch} onClose={close} /></Modal>}
      {modal?.t==="aG"  &&<Modal title="모임 만들기" onClose={close}><GrpForm me={meD} mbs={mbs} onSave={addGrp} onClose={close} /></Modal>}
    </>
  );
}

// ── LOGIN ─────────────────────────────────────────
function Login({mbs,onLogin,onSignup,onRefreshMbs}){
  const [id,setId]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState("");
  const go=async ()=>{
    if(!id.trim()||!pw.trim()){setErr("아이디와 비밀번호를 입력해주세요.");return;}
    setErr("확인 중...");
    // 항상 시트에서 최신 멤버 불러오기 (신규 가입자 포함)
    let allMbs=[...mbs];
    if(!API_URL.includes("여기에")){
      try{
        const freshMbs=await apiGet("getMembers");
        if(freshMbs&&freshMbs.length>0){
          allMbs=freshMbs;
          onRefreshMbs(freshMbs);
        }
      }catch(e){}
    }
    const found=allMbs.find(m=>String(m.name).trim()===id.trim());
    if(!found){setErr("존재하지 않는 아이디입니다.");setTimeout(()=>setErr(""),2000);return;}
    // 숫자/문자열 모두 대응
    if(String(found.pw).trim()!==String(pw).trim()){setErr("비밀번호가 틀렸습니다.");setTimeout(()=>setErr(""),2000);return;}
    setErr("");
    onLogin(found);
  };
  const cardW = 360;
  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:cardW,maxWidth:"calc(100vw - 40px)",background:T.card,borderRadius:20,padding:"40px 36px",border:`1px solid ${T.border}`,boxShadow:"0 8px 40px rgba(92,60,24,.14)",boxSizing:"border-box",overflow:"hidden"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:34,marginBottom:8}}>🕯</div>
          <div style={{fontSize:20,fontWeight:900,color:T.gold}}>머더 미스터리 기록</div>
          <div style={{fontSize:10,color:T.muted,marginTop:4,letterSpacing:2}}>MURDER MYSTERY RECORD</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:6}}>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:T.sub,display:"block",marginBottom:5}}>아이디</label>
            <input value={id} onChange={e=>setId(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
              placeholder="아이디를 입력하세요" autoComplete="username"
              style={{width:"100%",padding:"10px 14px",background:"#FFFDF9",border:`1.5px solid ${err?T.red:T.border}`,borderRadius:8,color:T.text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}} />
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:T.sub,display:"block",marginBottom:5}}>비밀번호</label>
            <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
              placeholder="비밀번호를 입력하세요" autoComplete="current-password"
              style={{width:"100%",padding:"10px 14px",background:"#FFFDF9",border:`1.5px solid ${err?T.red:T.border}`,borderRadius:8,color:T.text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}} />
          </div>
        </div>
        {err&&<div style={{fontSize:12,color:T.red,fontWeight:600,textAlign:"center",margin:"8px 0"}}>{err}</div>}
        <div style={{marginTop:16}}>
          <GBtn full onClick={go}>로그인</GBtn>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,margin:"16px 0"}}>
          <div style={{flex:1,height:1,background:T.border}} />
          <span style={{fontSize:11,color:T.muted}}>또는</span>
          <div style={{flex:1,height:1,background:T.border}} />
        </div>
        <button className="btn" onClick={onSignup} style={{width:"100%",padding:"10px",background:"transparent",color:T.gold,borderRadius:10,fontSize:13,border:`1.5px solid ${T.gold}`,fontWeight:700,boxSizing:"border-box"}}>+ 새 계정 만들기</button>
      </div>
    </div>
  );
}

// ── SIGNUP ────────────────────────────────────────
function Signup({onDone,onBack,ids}){
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({name:"",pw:"",av:"🕵️"});
  const [ans,setAns]=useState(Array(SURVEY.length).fill(null));
  const [uploaded,setUploaded]=useState(0);
  const [result,setResult]=useState(null);
  const fileRef=useRef();
  const total=SURVEY.length+3;

  const handleFile=e=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{const n=ev.target.result.split("\n").slice(1).filter(l=>l.trim()).length;setUploaded(n);};
    r.readAsText(f);
  };

  const doCalc=()=>{
    const r=calcStyles(ans);
    setResult(r);
    setStep(SURVEY.length+1);
  };

  const finish=async ()=>{
    const id=Math.max(...ids)+1;
    const newMember={id,name:form.name,av:form.av,role:"member",style:result.style,style2:result.style2||"",pw:form.pw,friends:"[]"};
    if(!API_URL.includes("여기에")){
      try {
        await apiPost("addMember", newMember);
        console.log("✅ 회원 시트 저장 완료");
      } catch(e){ console.error("❌ 회원 저장 실패:", e.message); }
    }
    onDone({...newMember, friends:[]});
  };

  const pct=Math.round((step/total)*100);

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:460,maxWidth:"calc(100vw - 40px)",background:T.card,borderRadius:20,padding:"36px 36px",border:`1px solid ${T.border}`,boxShadow:"0 8px 40px rgba(92,60,24,.14)",boxSizing:"border-box",overflow:"hidden"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontFamily:"'Noto Sans KR',sans-serif",fontSize:19,fontWeight:700,color:T.gold}}>회원가입</div>
          <div style={{fontSize:12,color:T.muted}}>Step {step+1}/{total}</div>
        </div>
        <div style={{height:4,background:T.border,borderRadius:2,marginBottom:26}}>
          <div style={{height:"100%",width:`${pct}%`,background:T.gold,borderRadius:2,transition:"width .4s"}} />
        </div>

        {step===0&&(
          <div className="fade">
            <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:18}}>기본 정보 입력</div>
            <Fld label="닉네임"><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="탐정 이름" style={{...inp,marginBottom:12}} /></Fld>
            <Fld label="비밀번호"><input type="password" value={form.pw} onChange={e=>setForm(p=>({...p,pw:e.target.value}))} style={{...inp,marginBottom:14}} /></Fld>
            <Fld label="아바타 이모지">
              <div style={{display:"flex",alignItems:"center",gap:12,marginTop:4,marginBottom:16}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:T.goldL,border:`2px solid ${T.gold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0}}>{form.av||"🕵️"}</div>
                <div style={{flex:1}}>
                  <input value={form.av} onChange={e=>setForm(p=>({...p,av:e.target.value}))}
                    placeholder="이모지 입력 (예: 🦊 🎭 🌸)"
                    style={{...inp,fontSize:18}} maxLength={4} />
                  <div style={{fontSize:11,color:T.muted,marginTop:4}}>이모지를 직접 입력하거나 복붙하세요</div>
                </div>
              </div>
            </Fld>
            <GBtn full disabled={!form.name||!form.pw} onClick={()=>setStep(1)}>다음 →</GBtn>
          </div>
        )}

        {step>=1&&step<=SURVEY.length&&(()=>{
          const qi=step-1;const q=SURVEY[qi];
          return (
            <div className="fade">
              <div style={{fontSize:11,color:T.muted,fontWeight:700,letterSpacing:1,marginBottom:7}}>PLAY STYLE {step}/{SURVEY.length}</div>
              <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:18,lineHeight:1.5}}>{q.q}</div>
              <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:22}}>
                {q.opts.map((opt,i)=>(
                  <div key={i} className="hov" onClick={()=>{const a=[...ans];a[qi]=i;setAns(a);}}
                    style={{padding:"11px 15px",borderRadius:10,border:`1.5px solid ${ans[qi]===i?T.gold:T.border}`,
                      background:ans[qi]===i?T.goldL:T.paper,cursor:"pointer",fontSize:13,color:T.text,
                      display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${ans[qi]===i?T.gold:T.border}`,
                      background:ans[qi]===i?T.gold:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {ans[qi]===i&&<div style={{width:7,height:7,borderRadius:"50%",background:"#fff"}} />}
                    </div>
                    {opt.l}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:9}}>
                <OBtn onClick={()=>setStep(s=>s-1)}>← 이전</OBtn>
                {step<SURVEY.length
                  ?<GBtn full disabled={ans[qi]===null} onClick={()=>setStep(s=>s+1)}>다음 →</GBtn>
                  :<GBtn full disabled={ans[qi]===null} onClick={doCalc}>결과 보기 ✨</GBtn>
                }
              </div>
            </div>
          );
        })()}

        {step===SURVEY.length+1&&result&&(
          <div className="fade">
            <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:16,textAlign:"center"}}>🎉 당신의 플레이 스타일</div>
            <div style={{display:"flex",gap:10,marginBottom:20}}>
              {[{label:"주 타입",key:"style"},{label:"보조 타입",key:"style2"}].map(({label,key})=>{
                const st=result[key];if(!st)return null;const sm=SM[st]||{};
                return(
                  <div key={key} style={{flex:1,background:sm.bg,border:`2px solid ${sm.color}`,borderRadius:12,padding:"16px 14px",textAlign:"center"}}>
                    <div style={{fontSize:10,fontWeight:700,color:sm.color,letterSpacing:1,marginBottom:6}}>{label}</div>
                    <div style={{fontSize:28,marginBottom:4}}>{sm.icon}</div>
                    <div style={{fontSize:16,fontWeight:700,color:sm.color}}>{st}</div>
                    <div style={{fontSize:11,color:T.sub,marginTop:6,lineHeight:1.5}}>{sm.desc}</div>
                    <div style={{display:"flex",gap:8,marginTop:10,justifyContent:"center"}}>
                      <span style={{fontSize:10,color:T.green,background:"#DCFCE7",padding:"2px 7px",borderRadius:10}}>💪 {sm.str}</span>
                      <span style={{fontSize:10,color:T.red,background:"#FEE2E2",padding:"2px 7px",borderRadius:10}}>⚠️ {sm.weak}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:9}}>
              <OBtn onClick={()=>setStep(SURVEY.length)}>← 다시</OBtn>
              <GBtn full onClick={()=>setStep(SURVEY.length+2)}>다음 →</GBtn>
            </div>
          </div>
        )}

        {step===SURVEY.length+2&&(
          <div className="fade">
            <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:7}}>기존 기록 불러오기</div>
            <div style={{fontSize:13,color:T.sub,marginBottom:16,lineHeight:1.7}}>이전 플레이 기록이 있다면 CSV로 한 번에 업로드하세요. 없으면 건너뛰어도 됩니다!</div>
            <div style={{background:T.goldL,borderRadius:9,padding:"11px 14px",marginBottom:13}}>
              <div style={{fontSize:12,fontWeight:700,color:T.gold,marginBottom:4}}>📄 CSV 형식</div>
              <div style={{fontSize:11,color:"#92400E",fontFamily:"monospace",lineHeight:1.8}}>머더미스터리제목, 날짜, 결과, 평점, 후기<br/>검은 저택의 비밀, 2025-03-01, 성공, 5, 재밌었음<br/><br/>💡 역할은 나중에 마이페이지에서 수정할 수 있어요</div>
            </div>
            <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${T.border}`,borderRadius:11,padding:26,textAlign:"center",cursor:"pointer",background:T.paper,marginBottom:13}}>
              <div style={{fontSize:30,marginBottom:6}}>📂</div>
              <div style={{fontSize:13,fontWeight:600,color:T.sub}}>CSV 파일 드래그 또는 클릭</div>
              <input ref={fileRef} type="file" accept=".csv,.xlsx" onChange={handleFile} style={{display:"none"}} />
            </div>
            {uploaded>0&&(
              <div style={{background:"#DCFCE7",border:"1px solid #BBF7D0",borderRadius:8,padding:"10px 14px",marginBottom:13}}>
                <div style={{fontSize:13,fontWeight:700,color:T.green}}>✓ {uploaded}개 기록 확인!</div>
              </div>
            )}
            <div style={{display:"flex",gap:9}}>
              <OBtn onClick={()=>setStep(SURVEY.length+1)}>← 이전</OBtn>
              <GBtn full onClick={finish}>{uploaded>0?`기록 ${uploaded}개 포함 완료 🎉`:"건너뛰고 완료"}</GBtn>
            </div>
          </div>
        )}

        <div style={{textAlign:"center",marginTop:14}}>
          <button className="btn" onClick={onBack} style={{fontSize:12,color:T.muted,background:"transparent"}}>← 로그인으로</button>
        </div>
      </div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────
function Sidebar({page,setPage,me,badge,onLogout}){
  const s=SM[me?.style]||{};const s2=me?.style2?SM[me.style2]:null;
  return (
    <div style={{width:214,background:T.card,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh"}}>
      <div style={{padding:"20px 18px 14px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{fontFamily:"'Noto Sans KR',sans-serif",fontSize:13,fontWeight:900,color:T.gold}}>머더 미스터리 기록</div>
        <div style={{fontSize:9,color:T.muted,letterSpacing:1,marginTop:2}}>MURDER MYSTERY RECORD</div>
      </div>
      <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
        {NAV.map(n=>{
          const act=page===n.id;
          return (
            <div key={n.id} className="hov" onClick={()=>setPage(n.id)}
              style={{display:"flex",alignItems:"center",gap:9,padding:"9px 18px",
                borderLeft:act?`3px solid ${T.gold}`:"3px solid transparent",
                background:act?T.goldL:"transparent",color:act?T.gold:T.sub,
                fontSize:13,fontWeight:act?700:400}}>
              <span style={{fontSize:14}}>{n.ic}</span>{n.l}
              {n.id==="sc"&&badge>0&&<span style={{marginLeft:"auto",background:T.red,color:"#fff",fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:10}}>{badge}</span>}
            </div>
          );
        })}
      </nav>
      <div style={{padding:"12px 18px",borderTop:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:4}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:s.bg||T.goldL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,border:`2px solid ${s.color||T.gold}`}}>{me?.av}</div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:T.text}}>{me?.name}</div>
            <div style={{fontSize:10,color:s.color||T.gold,fontWeight:600}}>{s.icon} {me?.style}</div>
            {s2&&<div style={{fontSize:10,color:s2.color,fontWeight:600}}>{s2.icon} {me?.style2} <span style={{color:T.muted}}>(보조)</span></div>}
          </div>
        </div>
        <button className="btn" onClick={onLogout} style={{width:"100%",padding:5,fontSize:11,color:T.muted,background:T.paper,border:`1px solid ${T.border}`,borderRadius:6,marginTop:7}}>로그아웃</button>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────
function Dash({me,recs,schs,scens,grps,onAttend,onNav}){
  const myR=recs.filter(r=>r.mbs.includes(me.id));
  const wins=myR.filter(r=>r.res==="성공").length;
  const s=SM[me.style]||{};
  return (
    <div className="fade">
      <Hdr title="대시보드" sub={`${me.name} 탐정님, 오늘의 사건을 시작하세요`} />
      <div style={{background:s.bg||T.goldL,border:`1px solid ${s.color||T.gold}20`,borderRadius:13,padding:"15px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
        <div style={{fontSize:32}}>{s.icon||"🔍"}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,color:s.color||T.gold}}>{me.style} 탐정{me.style2?<span style={{color:T.muted,fontSize:11,fontWeight:400}}> + {SM[me.style2]?.icon} {me.style2}</span>:""}</div>
          <div style={{fontSize:12,color:T.sub,marginTop:2}}>{s.desc}</div>
        </div>
        <div style={{display:"flex",gap:16,fontSize:12,color:T.sub}}>
          <div><div style={{fontWeight:600,color:T.text}}>💪 {s.str}</div><div style={{fontSize:10}}>강점</div></div>
          <div><div style={{fontWeight:600,color:T.text}}>⚠️ {s.weak}</div><div style={{fontSize:10}}>약점</div></div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {l:"내 플레이",v:`${myR.length}회`,ic:"🎭",c:T.gold},
          {l:"성공률",v:myR.length?`${Math.round(wins/myR.length*100)}%`:"—",ic:"✅",c:T.green},
          {l:"내 MVP",v:`${myR.filter(r=>r.mvp===me.id).length}회`,ic:"🏆",c:"#D97706"},
          {l:"내 모임",v:`${grps.filter(g=>g.members.includes(me.id)).length}개`,ic:"🏠",c:"#7C3AED"},
        ].map(x=>(
          <div key={x.l} className="hov" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:11,padding:"16px 18px",boxShadow:T.sh}}>
            <div style={{fontSize:20,marginBottom:6}}>{x.ic}</div>
            <div style={{fontSize:21,fontWeight:700,color:x.c,fontFamily:"'Noto Sans KR',sans-serif"}}>{x.v}</div>
            <div style={{fontSize:11,color:T.muted,marginTop:3}}>{x.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Sec title="최근 플레이">
          {myR.length===0&&<Em c="기록이 없어요" />}
          {myR.slice(-3).reverse().map(r=>{const sc=scens.find(s=>s.id===r.scId);const charName=r.charNames?.[me.id];return(
            <div key={r.id} style={{padding:"9px 0",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{sc?.title||"—"}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:2}}>{r.date} · {charName?<span style={{color:T.gold,fontWeight:600}}>🎭 {charName}</span>:"—"}</div>
              </div>
              <Pill ok={r.res==="성공"}>{r.res}</Pill>
            </div>
          );})}
          <button className="btn" onClick={()=>onNav("my")} style={{fontSize:12,color:T.gold,background:"transparent",padding:"7px 0",marginTop:4}}>마이페이지 전체 보기 →</button>
        </Sec>
        <Sec title="다가오는 일정">
          {schs.map(s=>{const att=s.att.includes(me.id);return(
            <div key={s.id} style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:9,padding:"11px 13px",marginBottom:7}}>
              <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:3}}>{s.title}</div>
              <div style={{fontSize:11,color:T.muted}}>{s.date} {s.time} · {s.att.length}/{s.max}명</div>
              <button className="btn" onClick={()=>onAttend(s.id)} style={{marginTop:7,padding:"4px 13px",borderRadius:6,fontSize:12,background:att?T.goldL:"transparent",color:T.gold,border:`1.5px solid ${T.gold}`,fontWeight:600}}>{att?"✓ 참석중":"참석하기"}</button>
            </div>
          );})}
        </Sec>
      </div>
    </div>
  );
}

// ── MY PAGE ───────────────────────────────────────
function MyPage({me,recs,scens,onAdd,onEdit,onDel}){
  const myR=recs.filter(r=>r.mbs.includes(me.id));
  const wins=myR.filter(r=>r.res==="성공").length;
  const s=SM[me.style]||{};const s2=me.style2?SM[me.style2]:null;
  const fileRef=useRef();
  const [upl,setUpl]=useState(null);
  const handleFile=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{setUpl(ev.target.result.split("\n").slice(1).filter(l=>l.trim()).length);};r.readAsText(f);};
  return (
    <div className="fade">
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:15,padding:"20px 24px",marginBottom:18,boxShadow:T.sh}}>
        <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:s.bg||T.goldL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,border:`3px solid ${s.color||T.gold}`,flexShrink:0}}>{me.av}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Noto Sans KR',sans-serif",fontSize:20,fontWeight:700,color:T.text}}>{me.name}</div>
            <div style={{display:"flex",gap:7,marginTop:4,flexWrap:"wrap"}}>
              <span style={{fontSize:11,fontWeight:700,color:s.color,background:s.bg,padding:"2px 9px",borderRadius:20}}>{s.icon} {me.style} <span style={{opacity:.7}}>주</span></span>
              {s2&&<span style={{fontSize:11,fontWeight:700,color:s2.color,background:s2.bg,padding:"2px 9px",borderRadius:20}}>{s2.icon} {me.style2} <span style={{opacity:.7}}>보조</span></span>}
              <span style={{fontSize:11,color:T.muted}}>{me.role==="admin"?"👑 관리자":"멤버"}</span>
            </div>
            <div style={{display:"flex",gap:16,marginTop:11}}>
              {[["총 플레이",`${myR.length}회`],["성공",`${wins}회`],["실패",`${myR.length-wins}회`],["MVP",`${myR.filter(r=>r.mvp===me.id).length}회`]].map(([l,v])=>(
                <div key={l}><div style={{fontSize:17,fontWeight:700,color:T.gold,fontFamily:"'Noto Sans KR',sans-serif"}}>{v}</div><div style={{fontSize:10,color:T.muted}}>{l}</div></div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:7,flexDirection:"column",alignItems:"flex-end"}}>
            <GBtn onClick={onAdd}>+ 기록 추가</GBtn>
            <button className="btn" onClick={()=>fileRef.current?.click()} style={{padding:"6px 13px",fontSize:12,color:T.gold,background:"transparent",border:`1.5px solid ${T.gold}`,borderRadius:7}}>📂 일괄 업로드</button>
            <button className="btn" onClick={()=>{
              const csv="머더미스터리제목,날짜,결과,평점,후기\n검은 저택의 비밀,2025-01-01,성공,5,정말 재미있었어요!\n베네치아의 독,2025-02-15,실패,4,다음엔 꼭 성공할거야";
              const blob=new Blob(["﻿"+csv],{type:"text/csv;charset=utf-8"});
              const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="머더미스터리_기록_양식.csv";a.click();
            }} style={{padding:"6px 13px",fontSize:12,color:T.green,background:"transparent",border:`1.5px solid ${T.green}`,borderRadius:7}}>📥 양식 다운로드</button>
            <input ref={fileRef} type="file" accept=".csv,.xlsx" onChange={handleFile} style={{display:"none"}} />
          </div>
        </div>
      </div>
      {upl&&<div style={{background:"#DCFCE7",border:"1px solid #BBF7D0",borderRadius:8,padding:"9px 14px",marginBottom:12,fontSize:13,color:T.green,fontWeight:600}}>✓ {upl}개 업로드됨 (데모)</div>}
      {myR.length===0&&<Em c="플레이 기록을 추가해보세요!" />}
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {myR.map(r=>{const sc=scens.find(s=>s.id===r.scId);const charName=r.charNames?.[me.id];const roleType=r.roleTypes?.[me.id];return(
          <div key={r.id} className="hov" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:11,padding:"14px 18px",display:"flex",gap:13,boxShadow:T.sh}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:5}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text}}>{sc?.title||"?"}</div>
                <Pill ok={r.res==="성공"}>{r.res}</Pill>
                {r.mvp===me.id&&<span>🏆</span>}
              </div>
              <div style={{fontSize:11,color:T.muted,marginBottom:6,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <span>📅 {r.date}</span>
                {charName&&<span style={{background:T.goldL,color:T.gold,fontWeight:700,padding:"1px 8px",borderRadius:10}}>🎭 {charName}</span>}
                {roleType&&<span className="spoiler" style={{fontSize:10,color:T.muted}}>[{roleType}]</span>}
                <span>⭐{r.rats[me.id]}</span>
              </div>
              {r.rev&&<div className={r.sp?"spoiler":""} style={{fontSize:12,color:T.sub,padding:"5px 9px",background:T.paper,borderRadius:5,borderLeft:`3px solid ${T.border}`}}>{r.sp&&<span style={{fontSize:10,color:T.red,marginRight:5}}>[스포주의]</span>}{r.rev}</div>}
            </div>
            <div style={{display:"flex",gap:5}}><OBtn sm onClick={()=>onEdit(r)}>수정</OBtn><OBtn sm red onClick={()=>{if(window.confirm("삭제?"))onDel(r.id);}}>삭제</OBtn></div>
          </div>
        );})}
      </div>
    </div>
  );
}

// ── FRIENDS ───────────────────────────────────────
function Friends({me,mbs,recs,onAddFri}){
  const [tab,setTab]=useState("list");
  const [search,setSearch]=useState("");
  const [sel,setSel]=useState(null);
  const myFri=mbs.filter(m=>me.friends?.includes(m.id));
  const sf=sel?mbs.find(m=>m.id===sel):null;
  const cs=sf?compat(me.style,sf.style):null;
  const ci=cs?cLabel(cs):null;
  const shared=sf?recs.filter(r=>r.mbs.includes(me.id)&&r.mbs.includes(sf.id)):[];
  const TIPS={"분석형-감성형":"분석형이 논리 수사, 감성형이 감정 독해—최강 분업!","분석형-직관형":"증거+직관의 황금 콤비!","감성형-연기형":"롤플레이 & 몰입 폭발 조합!","논리형-직관형":"체계적 정리 + 직관 = 완벽한 밸런스."};
  const getTip=(a,b)=>TIPS[`${a}-${b}`]||TIPS[`${b}-${a}`]||"서로의 다른 스타일로 약점을 보완해보세요!";
  return (
    <div className="fade">
      <Hdr title="친구 & 궁합" sub="함께 추리할 동료들의 케미를 분석하세요" />
      <div style={{display:"flex",gap:6,marginBottom:18}}>
        {[["list","👥 내 친구"],["search","🔍 친구 찾기"],["analysis","🧪 궁합 분석"]].map(([t,l])=>(
          <button key={t} className="btn" onClick={()=>setTab(t)} style={{padding:"7px 17px",borderRadius:8,fontSize:13,background:tab===t?T.gold:"transparent",color:tab===t?"#fff":T.sub,border:`1.5px solid ${tab===t?T.gold:T.border}`,fontWeight:tab===t?700:400}}>{l}</button>
        ))}
      </div>
      {tab==="list"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:11}}>
          {myFri.length===0&&<Em c="아직 친구가 없어요!" />}
          {myFri.map(f=>{const sc=compat(me.style,f.style);const info=cLabel(sc);const sm=SM[f.style]||{};return(
            <div key={f.id} className="hov" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:11,padding:16,boxShadow:T.sh,cursor:"pointer"}} onClick={()=>{setSel(f.id);setTab("analysis");}}>
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:11}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:sm.bg||T.goldL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,border:`2px solid ${sm.color||T.gold}`}}>{f.av}</div>
                <div><div style={{fontSize:13,fontWeight:700,color:T.text}}>{f.name}</div><div style={{fontSize:11,color:sm.color,fontWeight:600}}>{sm.icon} {f.style}</div></div>
              </div>
              <div style={{fontSize:11,color:T.muted,marginBottom:4}}>궁합 점수</div>
              <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{flex:1,height:5,background:T.border,borderRadius:3}}><div style={{height:"100%",width:`${sc}%`,background:info.c,borderRadius:3}} /></div><span style={{fontSize:13,fontWeight:700,color:info.c}}>{sc}</span></div>
              <div style={{fontSize:11,color:info.c,marginTop:3,fontWeight:600}}>{info.l}</div>
            </div>
          );})}
        </div>
      )}
      {tab==="search"&&(
        <div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="이름으로 검색..." style={{...inp,maxWidth:280,marginBottom:14}} />
          {mbs.filter(m=>m.id!==me.id&&(search===""||m.name.includes(search))).map(m=>{
            const isFr=me.friends?.includes(m.id);const sm=SM[m.style]||{};const sc=compat(me.style,m.style);const info=cLabel(sc);
            return(
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",background:T.card,border:`1px solid ${T.border}`,borderRadius:11,marginBottom:7,boxShadow:T.sh}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:sm.bg||T.goldL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,border:`2px solid ${sm.color||T.gold}`}}>{m.av}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:T.text}}>{m.name}</div><div style={{fontSize:11,color:sm.color,fontWeight:600}}>{sm.icon} {m.style}</div></div>
                <div style={{textAlign:"right",marginRight:10}}><div style={{fontSize:13,fontWeight:700,color:info.c}}>{sc}점</div><div style={{fontSize:11,color:T.muted}}>{info.l}</div></div>
                {isFr?<span style={{fontSize:12,color:T.green,fontWeight:700}}>✓ 친구</span>:<GBtn sm onClick={()=>onAddFri(m.id)}>+ 추가</GBtn>}
              </div>
            );
          })}
        </div>
      )}
      {tab==="analysis"&&(
        <div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:11,fontWeight:700,color:T.sub,display:"block",marginBottom:7}}>분석할 친구 선택</label>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {myFri.map(f=>(
                <div key={f.id} className="hov" onClick={()=>setSel(f.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:20,border:`1.5px solid ${sel===f.id?T.gold:T.border}`,background:sel===f.id?T.goldL:T.paper,cursor:"pointer"}}>
                  <span style={{fontSize:17}}>{f.av}</span><span style={{fontSize:13,fontWeight:sel===f.id?700:400}}>{f.name}</span>
                </div>
              ))}
            </div>
          </div>
          {sf&&ci&&(
            <div className="fade">
              <div style={{background:T.card,border:`2px solid ${ci.c}20`,borderRadius:15,padding:"24px 28px",marginBottom:16,boxShadow:T.sh,textAlign:"center"}}>
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:24,marginBottom:16}}>
                  {[{m:me,sm:SM[me.style]||{}},{m:sf,sm:SM[sf.style]||{}}].map((x,i)=>(
                    <div key={i} style={{textAlign:"center"}}>
                      <div style={{width:48,height:48,borderRadius:"50%",background:x.sm.bg||T.goldL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:`2px solid ${x.sm.color||T.gold}`,margin:"0 auto 7px"}}>{x.m.av}</div>
                      <div style={{fontSize:13,fontWeight:700,color:T.text}}>{x.m.name}</div>
                      <div style={{fontSize:11,color:x.sm.color,fontWeight:600}}>{x.sm.icon} {x.m.style}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontFamily:"'Noto Sans KR',sans-serif",fontSize:48,fontWeight:700,color:ci.c,lineHeight:1}}>{cs}</div>
                <div style={{fontSize:13,fontWeight:700,color:ci.c,marginTop:4}}>{ci.l}</div>
                <div style={{height:7,background:T.border,borderRadius:4,maxWidth:260,margin:"11px auto 0"}}><div style={{height:"100%",width:`${cs}%`,background:ci.c,borderRadius:4,transition:"width .8s"}} /></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
                <Sec title="🎮 함께한 기록">
                  <div style={{fontSize:13,color:T.sub,marginBottom:9}}>총 <b style={{color:T.text}}>{shared.length}회</b> · 승률 <b style={{color:T.green}}>{shared.length?Math.round(shared.filter(r=>r.res==="성공").length/shared.length*100):0}%</b></div>
                  {shared.slice(0,4).map(r=><div key={r.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:12}}><span>{r.date}</span><Pill ok={r.res==="성공"}>{r.res}</Pill></div>)}
                  {shared.length===0&&<Em c="아직 함께한 기록 없음" />}
                </Sec>
                <Sec title="💡 추천 전략">
                  <div style={{fontSize:13,color:T.sub,lineHeight:1.8,padding:"9px 11px",background:T.paper,borderRadius:7,borderLeft:`3px solid ${T.gold}`}}>{getTip(me.style,sf.style)}</div>
                </Sec>
              </div>
            </div>
          )}
          {!sf&&<Em c="친구를 선택하면 궁합 분석이 나타납니다." />}
          {myFri.length===0&&<Em c="먼저 친구를 추가해보세요!" />}
        </div>
      )}
    </div>
  );
}

// ── GROUPS ────────────────────────────────────────
function Groups({me,grps,mbs,recs,onAdd}){
  const myG=grps.filter(g=>g.members.includes(me.id));
  const [sel,setSel]=useState(null);
  const sg=sel?grps.find(g=>g.id===sel):null;
  return (
    <div className="fade">
      <Hdr title="모임 관리" sub="함께하는 모임의 케미스트리를 확인하세요" action={<GBtn onClick={onAdd}>+ 모임 만들기</GBtn>} />
      <div style={{display:"grid",gridTemplateColumns:"270px 1fr",gap:16,alignItems:"start"}}>
        <div>
          {myG.length===0&&<Em c="모임이 없어요!" />}
          {myG.map(g=>{
            const gm=g.members.map(id=>mbs.find(m=>m.id===id)).filter(Boolean);
            const pairs=[];for(let i=0;i<gm.length;i++)for(let j=i+1;j<gm.length;j++)pairs.push(compat(gm[i].style||"분석형",gm[j].style||"분석형"));
            const avg=pairs.length?Math.round(pairs.reduce((s,p)=>s+p,0)/pairs.length):0;
            return(
              <div key={g.id} className="hov" onClick={()=>setSel(g.id)} style={{background:T.card,border:`1.5px solid ${sel===g.id?T.gold:T.border}`,borderRadius:11,padding:"13px 15px",marginBottom:9,cursor:"pointer",boxShadow:T.sh}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:3}}>{g.name}</div>
                <div style={{fontSize:11,color:T.muted,marginBottom:7}}>{g.desc}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",gap:3}}>{gm.map(m=><span key={m.id} style={{fontSize:16}}>{m.av}</span>)}</div>
                  <span style={{fontSize:12,fontWeight:700,color:cLabel(avg).c}}>궁합 {avg}점</span>
                </div>
              </div>
            );
          })}
        </div>
        {sg?(()=>{
          const gm=sg.members.map(id=>mbs.find(m=>m.id===id)).filter(Boolean);
          const gR=recs.filter(r=>sg.members.some(id=>r.mbs.includes(id)));
          const gW=gR.filter(r=>r.res==="성공").length;
          const pairs=[];for(let i=0;i<gm.length;i++)for(let j=i+1;j<gm.length;j++){const sc=compat(gm[i].style||"분석형",gm[j].style||"분석형");pairs.push({a:gm[i],b:gm[j],sc});}
          pairs.sort((a,b)=>b.sc-a.sc);
          const avg=pairs.length?Math.round(pairs.reduce((s,p)=>s+p.sc,0)/pairs.length):0;
          return(
            <div className="fade">
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:13,padding:"18px 22px",marginBottom:13,boxShadow:T.sh}}>
                <div style={{fontFamily:"'Noto Sans KR',sans-serif",fontSize:17,fontWeight:700,color:T.text,marginBottom:3}}>{sg.name}</div>
                <div style={{fontSize:12,color:T.muted,marginBottom:12}}>{sg.desc}</div>
                <div style={{display:"flex",gap:18}}>
                  {[["멤버",`${gm.length}명`],["기록",`${gR.length}회`],["승률",gR.length?`${Math.round(gW/gR.length*100)}%`:"—"],["평균 궁합",`${avg}점`]].map(([l,v])=>(
                    <div key={l}><div style={{fontSize:17,fontWeight:700,color:T.gold,fontFamily:"'Noto Sans KR',sans-serif"}}>{v}</div><div style={{fontSize:10,color:T.muted}}>{l}</div></div>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Sec title="🧩 멤버 스타일">
                  {gm.map(m=>{const sm=SM[m.style]||{};return(
                    <div key={m.id} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                      <div style={{width:30,height:30,borderRadius:"50%",background:sm.bg||T.goldL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,border:`1.5px solid ${sm.color||T.gold}`}}>{m.av}</div>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{m.name}</div><div style={{fontSize:11,color:sm.color,fontWeight:600}}>{sm.icon} {m.style}</div></div>
                      {m.id===sg.owner&&<span style={{fontSize:10,color:T.gold,background:T.goldL,padding:"2px 6px",borderRadius:8}}>호스트</span>}
                    </div>
                  );})}
                </Sec>
                <Sec title={`💑 궁합 랭킹 (평균 ${avg}점)`}>
                  {pairs.map((p,i)=>{const info=cLabel(p.sc);return(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                      <span style={{fontSize:12,color:T.muted,minWidth:16}}>{i+1}</span>
                      <span style={{fontSize:15}}>{p.a.av}</span><span style={{fontSize:10,color:T.muted}}>×</span><span style={{fontSize:15}}>{p.b.av}</span>
                      <div style={{flex:1,fontSize:12}}><div style={{color:T.text}}>{p.a.name} & {p.b.name}</div><div style={{color:info.c,fontWeight:600,fontSize:11}}>{info.l}</div></div>
                      <div style={{fontFamily:"'Noto Sans KR',sans-serif",fontSize:17,fontWeight:700,color:info.c}}>{p.sc}</div>
                    </div>
                  );})}
                </Sec>
              </div>
            </div>
          );
        })():(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:260,color:T.muted,fontSize:14,background:T.card,borderRadius:13,border:`1px solid ${T.border}`}}>← 모임 선택 시 궁합 분석이 표시됩니다</div>
        )}
      </div>
    </div>
  );
}

// ── ALL RECORDS ───────────────────────────────────
function AllRecs({recs,scens,mbs,me,onAdd}){
  return(
    <div className="fade">
      <Hdr title="전체 기록" sub="탐정단의 모든 사건 파일" action={<GBtn onClick={onAdd}>+ 내 기록 추가</GBtn>} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
        {recs.map(r=>{const sc=scens.find(s=>s.id===r.scId);const mvpM=mbs.find(m=>m.id===r.mvp);return(
          <div key={r.id} className="hov" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:11,padding:16,boxShadow:T.sh}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:14,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",color:T.text}}>{sc?.title}</div><Pill ok={r.res==="성공"}>{r.res}</Pill></div>
            <div style={{fontSize:11,color:T.muted,marginBottom:9}}>📅 {r.date} · 🏆 {mvpM?.av} {mvpM?.name}</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {r.mbs.map(mid=>{const mb=mbs.find(m=>m.id===mid);const charName=r.charNames?.[mid];return(
                <div key={mid} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:20,fontSize:11,background:mid===me.id?T.goldL:T.paper,color:mid===me.id?T.gold:T.sub,border:`1px solid ${mid===me.id?"#FDE68A":T.border}`}}>
                  {mb?.av} {charName||mb?.name}
                  {r.roleTypes?.[mid]&&<span className="spoiler" style={{marginLeft:3,fontSize:10}}>({r.roleTypes[mid]})</span>}
                </div>
              );})}
            </div>
            {r.rev&&<div className={r.sp?"spoiler":""} style={{marginTop:9,fontSize:12,color:T.sub,padding:"5px 9px",background:T.paper,borderRadius:5}}>{r.sp&&<span style={{fontSize:10,color:T.red,marginRight:5}}>[스포주의]</span>}{r.rev}</div>}
          </div>
        );})}
      </div>
    </div>
  );
}

// ── SCENARIOS ─────────────────────────────────────
function Scenarios({scens,me,recs,mbs,onSubmit,onApprove,onReject,loading}){
  const [filter,setFilter]=useState("전체");
  const [expanded,setExpanded]=useState(null);
  const themes=["전체","공포","로맨스","고전","미스터리","스릴러","코미디"];
  const pending=scens.filter(s=>!s.ok&&s.st==="pending");
  const official=scens.filter(s=>s.ok&&(filter==="전체"||s.theme===filter));
  return(
    <div className="fade">
      <Hdr title="시나리오 DB" sub="공식 & 멤버 제보 시나리오" action={<GBtn onClick={onSubmit}>+ 시나리오 제보</GBtn>} />
      {loading&&<div style={{textAlign:"center",padding:"20px",color:T.muted,fontSize:13}}>⏳ 시나리오 불러오는 중...</div>}
      {me.role==="admin"&&pending.length>0&&(
        <div style={{background:"#FEE2E2",border:"1px solid #FECACA",borderRadius:11,padding:"13px 17px",marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:T.red,marginBottom:9}}>⏳ 승인 대기 {pending.length}건</div>
          {pending.map(s=>{const sub=INIT_MB.find(m=>m.id===s.sub);return(
            <div key={s.id} style={{background:"#fff",borderRadius:9,padding:"9px 13px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div><div style={{fontSize:13,fontWeight:700,color:T.text}}>{s.title} <span style={{fontSize:11,color:T.gold,fontWeight:400}}>[{s.theme}]</span></div><div style={{fontSize:11,color:T.muted,marginTop:2}}>{s.subAt} · {sub?.av} {sub?.name}</div>{s.note&&<div style={{fontSize:11,color:T.sub,fontStyle:"italic",marginTop:2}}>"{s.note}"</div>}</div>
              <div style={{display:"flex",gap:5}}><button className="btn" onClick={()=>onApprove(s.id)} style={{padding:"4px 11px",borderRadius:6,fontSize:12,background:"#DCFCE7",color:T.green,border:"1px solid #BBF7D0",fontWeight:600}}>✓ 승인</button><button className="btn" onClick={()=>onReject(s.id)} style={{padding:"4px 11px",borderRadius:6,fontSize:12,background:"#FEE2E2",color:T.red,border:"1px solid #FECACA",fontWeight:600}}>✕ 거절</button></div>
            </div>
          );})}
        </div>
      )}
      {me.role!=="admin"&&pending.filter(s=>s.sub===me.id).length>0&&(
        <div style={{background:T.goldL,border:"1px solid #FDE68A",borderRadius:8,padding:"9px 13px",marginBottom:13}}>
          <div style={{fontSize:12,fontWeight:700,color:T.gold,marginBottom:3}}>내 제보 현황</div>
          {pending.filter(s=>s.sub===me.id).map(s=><div key={s.id} style={{fontSize:12,color:"#92400E"}}>⏳ {s.title} — 승인 대기중</div>)}
        </div>
      )}
      <div style={{display:"flex",gap:7,marginBottom:14,flexWrap:"wrap"}}>
        {themes.map(t=><button key={t} className="btn" onClick={()=>setFilter(t)} style={{padding:"5px 13px",borderRadius:20,fontSize:12,background:filter===t?T.gold:"transparent",color:filter===t?"#fff":T.sub,border:`1px solid ${filter===t?T.gold:T.border}`,fontWeight:filter===t?700:400}}>{t}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13}}>
        {official.map(s=>(
          <div key={s.id} className="hov" style={{background:T.card,border:`1px solid ${expanded===s.id?T.gold:T.border}`,borderRadius:11,padding:16,boxShadow:T.sh}} onClick={()=>setExpanded(expanded===s.id?null:s.id)}>
            <div style={{fontSize:11,marginBottom:5}}><span style={{background:T.goldL,color:T.gold,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{s.theme}</span></div>
            <div style={{fontSize:14,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",color:T.text,marginBottom:6}}>{s.title}</div>
            <div style={{display:"flex",gap:9,fontSize:11,color:T.muted,marginBottom:6}}><span>👥 {s.pl}</span><span>⏱ {s.time}분</span><span>{"★".repeat(s.diff)}{"☆".repeat(5-s.diff)}</span></div>
            {s.rating&&<div style={{fontSize:12,color:"#D97706",marginBottom:6}}>{"⭐".repeat(Math.round(s.rating))} {s.rating}</div>}
            <div>{s.tags?.map(t=><span key={t} style={{display:"inline-block",margin:"2px 3px 2px 0",padding:"2px 7px",borderRadius:20,fontSize:11,background:T.goldL,color:T.gold,border:"1px solid #FDE68A"}}>#{t}</span>)}</div>
            {expanded===s.id&&s.characters?.length>0&&(
              <div style={{marginTop:12,borderTop:`1px solid ${T.border}`,paddingTop:10}} onClick={e=>e.stopPropagation()}>
                <div style={{fontSize:11,fontWeight:700,color:T.gold,marginBottom:8}}>등장인물 ({s.characters.length}명)</div>
                {s.characters.map(c=>(
                  <div key={c.id} style={{display:"flex",alignItems:"flex-start",gap:7,padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:700,color:T.text}}>{c.name}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:2}}>{c.hint}</div>
                    </div>
                    <span className="spoiler" style={{fontSize:10,color:T.muted,whiteSpace:"nowrap",padding:"2px 6px",background:T.paper,borderRadius:6,border:`1px solid ${T.border}`}}>{c.roleType}</span>
                  </div>
                ))}
              </div>
            )}
            {(s.characters?.length>0||true)&&<div style={{fontSize:11,color:T.gold,marginTop:8,textAlign:"center"}}>{expanded===s.id?"▲ 접기":"▼ 클릭해서 상세 보기"}</div>}
            {expanded===s.id&&(()=>{
              const scRecs=recs.filter(r=>r.scId===s.id&&r.rev);
              return scRecs.length>0?(
                <div style={{marginTop:10,borderTop:`1px solid ${T.border}`,paddingTop:10}} onClick={e=>e.stopPropagation()}>
                  <div style={{fontSize:11,fontWeight:700,color:T.gold,marginBottom:8}}>💬 플레이 후기 ({scRecs.length}건)</div>
                  {scRecs.map(r=>{const mb=mbs.find(m=>m.id===r.mvp);const reviewer=mbs.find(m=>r.mbs?.includes(m.id));return(
                    <div key={r.id} style={{padding:"8px 10px",background:T.paper,borderRadius:7,marginBottom:6,borderLeft:`3px solid ${T.gold}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:11,color:T.sub}}>{r.date} · {"⭐".repeat(Math.max(...Object.values(r.rats||{1:4})))}</span>
                        <Pill ok={r.res==="성공"}>{r.res}</Pill>
                      </div>
                      <div className={r.sp?"spoiler":""} style={{fontSize:12,color:T.text,lineHeight:1.6}}>
                        {r.sp&&<span style={{fontSize:10,color:T.red,marginRight:4}}>[스포주의]</span>}
                        {r.rev}
                      </div>
                    </div>
                  );})}
                </div>
              ):null;
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SCHEDULE ──────────────────────────────────────
function Schedule({me,schs,scens,mbs,grps,onAttend,onAdd}){
  return(
    <div className="fade">
      <Hdr title="일정·모집" sub="다음 사건을 함께할 동료를 모집하세요" action={<GBtn onClick={onAdd}>+ 일정 등록</GBtn>} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:15}}>
        {schs.map(s=>{const host=mbs.find(m=>m.id===s.host);const att=s.att.includes(me.id);const grp=grps.find(g=>g.id===s.gId);const pct=Math.round(s.att.length/s.max*100);return(
          <div key={s.id} className="hov" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:13,padding:20,boxShadow:T.sh}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}><span style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:"#DCFCE7",color:T.green,fontWeight:600,border:"1px solid #BBF7D0"}}>● 모집중</span><span style={{fontSize:11,color:T.muted}}>{s.date} {s.time}</span></div>
            <div style={{fontSize:17,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",color:T.text,marginBottom:4}}>{s.title}</div>
            <div style={{fontSize:12,color:T.muted}}>📍 {s.loc}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>🎩 {host?.av} {host?.name}</div>
            {grp&&<div style={{fontSize:11,color:T.gold,marginTop:2}}>🏠 {grp.name}</div>}
            <div style={{height:4,background:T.border,borderRadius:2,margin:"11px 0 7px"}}><div style={{height:"100%",width:`${pct}%`,background:T.gold,borderRadius:2,transition:"width .4s"}} /></div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
              {mbs.map(m=>{const in_=s.att.includes(m.id);return(<div key={m.id} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:20,fontSize:11,background:in_?T.goldL:T.paper,color:in_?T.gold:T.muted,border:`1px solid ${in_?"#FDE68A":T.border}`}}>{m.av}{in_?" ✓":""}</div>);})}
              <span style={{fontSize:11,color:T.muted,alignSelf:"center"}}>{s.att.length}/{s.max}명</span>
            </div>
            <button className="btn" onClick={()=>onAttend(s.id)} style={{width:"100%",padding:9,borderRadius:8,fontSize:13,fontWeight:700,background:att?T.gold:"transparent",color:att?"#fff":T.gold,border:`2px solid ${T.gold}`}}>{att?"✓ 참석 취소":"🙋 참석하기"}</button>
          </div>
        );})}
      </div>
    </div>
  );
}

// ── RECOMMEND ─────────────────────────────────────
function Recommend({me,recs,scens}){
  const played=recs.filter(r=>r.mbs.includes(me.id)).map(r=>r.scId);
  const unplayed=scens.filter(s=>s.ok&&!played.includes(s.id));
  const chars={분석형:["탐정","조사관"],감성형:["연인","비서"],연기형:["범인","이중스파이"],직관형:["목격자","심령술사"],논리형:["검사","과학수사관"]};
  const ch=chars[me.style]||["탐정"];const sm=SM[me.style]||{};
  return(
    <div className="fade">
      <Hdr title="AI 추천" sub="플레이 기록 기반 맞춤 추천" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Sec title={`🎯 ${me.name}님의 미플레이 추천`}>
          {unplayed.length===0&&<Em c="모든 시나리오를 플레이했어요 🎉" />}
          {unplayed.slice(0,4).map(s=>(
            <div key={s.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
              <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{s.title}</div><div style={{fontSize:11,color:T.muted,marginTop:2}}>{s.theme} · {"★".repeat(s.diff)}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:12,color:"#D97706"}}>⭐{s.rating}</div><div style={{fontSize:10,color:T.green}}>추천 ↑</div></div>
            </div>
          ))}
        </Sec>
        <Sec title="🎭 추천 캐릭터">
          <div style={{fontSize:12,color:T.sub,marginBottom:11}}>{sm.icon} <b style={{color:sm.color}}>{me.style}</b>에 어울리는 역할</div>
          {ch.map((c,i)=>(
            <div key={c} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:7,background:i===0?sm.bg||T.goldL:T.paper,border:`1px solid ${i===0?sm.color||T.gold:T.border}`,marginBottom:7}}>
              <span style={{fontSize:17}}>{["🥇","🥈"][i]}</span>
              <div><div style={{fontSize:13,fontWeight:700,color:T.text}}>{c}</div>{i===0&&<div style={{fontSize:11,color:sm.color}}>최우선 추천</div>}</div>
            </div>
          ))}
        </Sec>
      </div>
    </div>
  );
}

// ── HALL OF FAME ──────────────────────────────────
function HoF({recs,mbs}){
  const stats=mbs.map(m=>{const myR=recs.filter(r=>r.mbs.includes(m.id));const wins=myR.filter(r=>r.res==="성공").length;const mvps=myR.filter(r=>r.mvp===m.id).length;return{...m,games:myR.length,wins,mvps,rate:myR.length?Math.round(wins/myR.length*100):0};}).sort((a,b)=>b.mvps-a.mvps);
  const medals=["🥇","🥈","🥉"];
  return(
    <div className="fade">
      <Hdr title="명예의 전당" sub="탐정단 최고의 기록" />
      <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:18,marginBottom:30,paddingTop:16}}>
        {[stats[1],stats[0],stats[2]].filter(Boolean).map((m,i)=>{const hs=[105,148,86];const ri=[1,0,2][i];const sm=SM[m.style]||{};return(
          <div key={m.id} style={{textAlign:"center"}}>
            <div style={{fontSize:26,marginBottom:5}}>{m.av}</div>
            <div style={{fontSize:13,fontWeight:700,color:T.text}}>{m.name}</div>
            <div style={{fontSize:11,color:sm.color,marginBottom:7}}>{sm.icon} {m.style}</div>
            <div style={{width:76,height:hs[i],background:i===1?T.goldL:"rgba(180,83,9,.06)",borderRadius:"7px 7px 0 0",display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${i===1?T.gold:T.border}`,fontSize:26}}>{medals[ri]}</div>
          </div>
        );})}
      </div>
      <Sec title="전체 랭킹">
        {stats.map((m,i)=>{const sm=SM[m.style]||{};return(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:13,padding:"11px 0",borderBottom:`1px solid ${T.border}`}}>
            <div style={{width:22,fontSize:15,textAlign:"center"}}>{medals[i]||`${i+1}`}</div>
            <div style={{width:32,height:32,borderRadius:"50%",background:sm.bg||T.goldL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,border:`1.5px solid ${sm.color||T.gold}`}}>{m.av}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:T.text}}>{m.name}</div><div style={{fontSize:11,color:sm.color,fontWeight:600}}>{sm.icon} {m.style} · 승률 {m.rate}%</div></div>
            {[["🏆",m.mvps,"MVP"],["✅",m.wins,"승리"],["🎭",m.games,"게임"]].map(([ic,v,l])=>(
              <div key={l} style={{textAlign:"center",minWidth:40}}><div style={{fontSize:13,fontWeight:700,color:T.gold}}>{ic} {v}</div><div style={{fontSize:10,color:T.muted}}>{l}</div></div>
            ))}
          </div>
        );})}
      </Sec>
    </div>
  );
}

// ── FORMS ─────────────────────────────────────────
function RecForm({scens,me,init,onSave,onClose}){
  const [f,setF]=useState(init||{scId:"",date:"",res:"성공",charNames:{[me.id]:""},roleTypes:{[me.id]:""},rats:{[me.id]:4},mbs:[me.id],mvp:me.id,rev:"",sp:false});
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const selScen=scens.find(s=>s.id===f.scId);
  const chars=selScen?.characters||[];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:13}}>
      <Fld label="시나리오 *">
        <select value={f.scId} onChange={e=>{const id=Number(e.target.value);u("scId",id);u("charNames",{[me.id]:""});u("roleTypes",{[me.id]:""});}} style={inp}>
          <option value="">선택</option>{scens.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </Fld>
      <Fld label="날짜 *"><input type="date" value={f.date} onChange={e=>u("date",e.target.value)} style={inp} /></Fld>
      <div style={{display:"flex",gap:9}}>
        <Fld label="내 캐릭터" flex={2}>
          {chars.length>0
            ?<select value={f.charNames[me.id]||""} onChange={e=>{const c=chars.find(x=>x.name===e.target.value);u("charNames",{...f.charNames,[me.id]:e.target.value});if(c)u("roleTypes",{...f.roleTypes,[me.id]:c.roleType||""});}} style={inp}>
              <option value="">캐릭터 선택</option>
              {chars.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            :<input value={f.charNames[me.id]||""} onChange={e=>u("charNames",{...f.charNames,[me.id]:e.target.value})} placeholder="캐릭터 이름 직접 입력" style={inp} />
          }
          {f.charNames[me.id]&&chars.find(c=>c.name===f.charNames[me.id])&&(
            <div style={{fontSize:11,color:T.muted,marginTop:4}}>💡 {chars.find(c=>c.name===f.charNames[me.id])?.hint}</div>
          )}
        </Fld>
        <Fld label="결과" flex={1}><select value={f.res} onChange={e=>u("res",e.target.value)} style={inp}><option>성공</option><option>실패</option></select></Fld>
        <Fld label="평점" flex={1}><select value={f.rats[me.id]||4} onChange={e=>u("rats",{...f.rats,[me.id]:Number(e.target.value)})} style={inp}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select></Fld>
      </div>
      {f.charNames[me.id]&&(
        <div style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:T.sub}}>
          역할 타입: <span className="spoiler">{f.roleTypes[me.id]||"—"}</span> <span style={{fontSize:10,color:T.muted}}>(hover 시 공개)</span>
        </div>
      )}
      <Fld label="후기"><textarea value={f.rev} onChange={e=>u("rev",e.target.value)} style={{...inp,height:65,resize:"vertical"}} /></Fld>
      <label style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:T.sub,cursor:"pointer"}}><input type="checkbox" checked={f.sp} onChange={e=>u("sp",e.target.checked)} /> 스포일러 포함</label>
      <div style={{display:"flex",gap:8}}><GBtn full onClick={()=>onSave(f)}>저장</GBtn><OBtn onClick={onClose}>취소</OBtn></div>
    </div>
  );
}

function ScenForm({me,onSave,onClose}){
  const [f,setF]=useState({title:"",theme:"공포",pl:"4-6",time:120,diff:3,tags:"",note:"",st:"pending"});
  const [chars,setChars]=useState([{name:"",hint:""}]);
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const addChar=()=>setChars(p=>[...p,{name:"",hint:""}]);
  const rmChar=i=>setChars(p=>p.filter((_,idx)=>idx!==i));
  const updateChar=(i,k,v)=>setChars(p=>p.map((c,idx)=>idx===i?{...c,[k]:v}:c));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:13}}>
      <div style={{background:T.goldL,borderRadius:8,padding:"9px 13px",fontSize:12,color:"#92400E",lineHeight:1.7}}>💡 직접 개발하거나 DB에 없는 시나리오를 제보해주세요.</div>
      <Fld label="제목 *"><input value={f.title} onChange={e=>u("title",e.target.value)} placeholder="시나리오 이름" style={inp} /></Fld>
      <div style={{display:"flex",gap:9}}>
        <Fld label="테마" flex={1}><select value={f.theme} onChange={e=>u("theme",e.target.value)} style={inp}>{["공포","로맨스","고전","미스터리","스릴러","코미디"].map(t=><option key={t}>{t}</option>)}</select></Fld>
        <Fld label="인원" flex={1}><input value={f.pl} onChange={e=>u("pl",e.target.value)} style={inp} /></Fld>
        <Fld label="시간(분)" flex={1}><input type="number" value={f.time} onChange={e=>u("time",e.target.value)} style={inp} /></Fld>
        <Fld label="난이도" flex={1}><input type="number" min="1" max="5" value={f.diff} onChange={e=>u("diff",e.target.value)} style={inp} /></Fld>
      </div>
      <Fld label="태그 (쉼표 구분)"><input value={f.tags} onChange={e=>u("tags",e.target.value)} placeholder="밀실, 유령저택" style={inp} /></Fld>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <label style={{fontSize:11,fontWeight:700,color:T.sub}}>등장인물</label>
          <button className="btn" onClick={addChar} style={{fontSize:12,color:T.gold,background:"transparent",border:`1px solid ${T.gold}`,borderRadius:6,padding:"3px 9px"}}>+ 추가</button>
        </div>
        {chars.map((c,i)=>(
          <div key={i} style={{display:"flex",gap:7,marginBottom:7,alignItems:"center"}}>
            <input value={c.name} onChange={e=>updateChar(i,"name",e.target.value)} placeholder="캐릭터 이름" style={{...inp,flex:1}} />
            <input value={c.hint} onChange={e=>updateChar(i,"hint",e.target.value)} placeholder="캐릭터 설명 (공개)" style={{...inp,flex:2}} />
            {chars.length>1&&<button className="btn" onClick={()=>rmChar(i)} style={{color:T.red,background:"none",fontSize:16,flexShrink:0}}>✕</button>}
          </div>
        ))}
      </div>
      <Fld label="메모"><textarea value={f.note} onChange={e=>u("note",e.target.value)} style={{...inp,height:55,resize:"vertical"}} /></Fld>
      <div style={{display:"flex",gap:8}}><GBtn full disabled={!f.title} onClick={()=>onSave({...f,time:Number(f.time),diff:Number(f.diff),tags:f.tags.split(",").map(t=>t.trim()).filter(Boolean),ok:false,sub:me.id,subAt:new Date().toISOString().slice(0,10),characters:chars.filter(c=>c.name)})}>제보하기</GBtn><OBtn onClick={onClose}>취소</OBtn></div>
    </div>
  );
}

function SchForm({me,scens,grps,onSave,onClose}){
  const [f,setF]=useState({scId:"",title:"",date:"",time:"19:00",loc:"",max:6,host:me.id,gId:""});
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const myG=grps.filter(g=>g.members.includes(me.id));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:13}}>
      <Fld label="시나리오"><select value={f.scId} onChange={e=>{const id=Number(e.target.value);const sc=scens.find(s=>s.id===id);setF(p=>({...p,scId:id,title:sc?sc.title:p.title}));}} style={inp}><option value="">선택</option>{scens.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></Fld>
      <div style={{display:"flex",gap:9}}>
        <Fld label="날짜" flex={1}><input type="date" value={f.date} onChange={e=>u("date",e.target.value)} style={inp} /></Fld>
        <Fld label="시간" flex={1}><input type="time" value={f.time} onChange={e=>u("time",e.target.value)} style={inp} /></Fld>
      </div>
      <Fld label="장소"><input value={f.loc} onChange={e=>u("loc",e.target.value)} placeholder="예) 홍대 미스터리룸" style={inp} /></Fld>
      <div style={{display:"flex",gap:9}}>
        <Fld label="최대 인원" flex={1}><input type="number" min="2" max="20" value={f.max} onChange={e=>u("max",Number(e.target.value))} style={inp} /></Fld>
        <Fld label="모임 연결 (선택)" flex={2}><select value={f.gId} onChange={e=>u("gId",Number(e.target.value)||"")} style={inp}><option value="">없음</option>{myG.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></Fld>
      </div>
      <div style={{display:"flex",gap:8}}><GBtn full disabled={!f.scId||!f.date} onClick={()=>onSave(f)}>등록</GBtn><OBtn onClick={onClose}>취소</OBtn></div>
    </div>
  );
}

function GrpForm({me,mbs,onSave,onClose}){
  const [f,setF]=useState({name:"",desc:"",members:[me.id]});
  const toggle=id=>setF(p=>({...p,members:p.members.includes(id)?p.members.filter(i=>i!==id):[...p.members,id]}));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:13}}>
      <Fld label="모임 이름 *"><input value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="예) 홍대 추리단" style={inp} /></Fld>
      <Fld label="소개"><textarea value={f.desc} onChange={e=>setF(p=>({...p,desc:e.target.value}))} style={{...inp,height:55,resize:"vertical"}} /></Fld>
      <Fld label="멤버 선택">
        <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:5}}>
          {mbs.filter(m=>m.id!==me.id).map(m=>{const sel=f.members.includes(m.id);return(
            <div key={m.id} onClick={()=>toggle(m.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 11px",borderRadius:8,border:`1.5px solid ${sel?T.gold:T.border}`,background:sel?T.goldL:T.paper,cursor:"pointer"}}>
              <span style={{fontSize:17}}>{m.av}</span><span style={{fontSize:13,flex:1}}>{m.name}</span>{sel&&<span style={{color:T.gold}}>✓</span>}
            </div>
          );})}
        </div>
      </Fld>
      <div style={{display:"flex",gap:8}}><GBtn full disabled={!f.name||f.members.length<2} onClick={()=>onSave(f)}>모임 만들기</GBtn><OBtn onClick={onClose}>취소</OBtn></div>
    </div>
  );
}
