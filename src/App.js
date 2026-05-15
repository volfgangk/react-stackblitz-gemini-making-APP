import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, Home, User, Bell, Settings, FileText, Zap, 
  Calendar, Coffee, Users, X, ChevronLeft, 
  CheckCircle2, Copy, CornerDownRight, AlertCircle, Clock, Check
} from 'lucide-react';

// ==========================================
// [CTO CONFIG] 상수 및 초기 목업 데이터
// ==========================================
const TEMPLATES = [
  { id: 1, title: '팀 회식', icon: <Coffee className="w-4 h-4 text-pink-500" />, bgColor: 'bg-[#FFD6E0]' },
  { id: 2, title: '프로젝트명', icon: <Zap className="w-4 h-4 text-orange-500" />, bgColor: 'bg-[#FFE4B5]' },
  { id: 3, title: '워크샵 일정', icon: <Calendar className="w-4 h-4 text-purple-500" />, bgColor: 'bg-[#E6D7FF]' },
  { id: 4, title: '회의 개선', icon: <Users className="w-4 h-4 text-pink-500" />, bgColor: 'bg-[#FFD6E0]' },
];

const MAX_ROOT_NODES = 7;
const MAX_DEPTH = 2; 
const MAX_CHILDREN = 3;

const INITIAL_MOCK_DATA = [
  {
    id: 10001,
    title: "🔥 2026 하반기 팀 워크샵 장소 정하기 (테스트)",
    status: "진행중",
    dDay: "D-2",
    voters: 8,
    options: [
      { id: '1', text: '제주도', voteCount: 5 },
      { id: '1-1', text: '함덕 해변 근처', voteCount: 2 },
      { id: '1-2', text: '서귀포 숲속', voteCount: 3 },
      { id: '2', text: '강릉/속초', voteCount: 3 },
      { id: '2-1', text: '안목해변 커피거리', voteCount: 1 },
      { id: '2-2', text: '설악산 근처 산장', voteCount: 2 }
    ]
  },
  {
    id: 10002,
    title: "✨ 신규 서비스 로고 시안 투표 (테스트)",
    status: "투표 대기",
    dDay: "D-5",
    voters: 0,
    options: [
      { id: '1', text: 'A안 (모던)', voteCount: 0 },
      { id: '2', text: 'B안 (클래식)', voteCount: 0 }
    ]
  }
];

// ==========================================
// [COMPONENTS] UI 공통 부품
// ==========================================
const Toast = ({ message }) => {
  if (!message) return null;
  return (
    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#D3FF75] to-[#B6FF33] border border-[#A5F220] shadow-[0_10px_30px_-5px_rgba(182,255,51,0.5)] text-[#2C4000] px-7 py-3.5 rounded-full z-50 flex items-center gap-2 animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-300 w-max max-w-[95%]">
      <span className="text-lg leading-none">✨</span>
      <span className="text-[13px] font-black tracking-tight whitespace-nowrap mt-0.5">{message}</span>
    </div>
  );
};

const BottomNav = ({ view, setView, showToast }) => (
  <nav className="absolute bottom-0 w-full h-[76px] bg-white border-t border-gray-100 flex justify-around px-2 pt-3 pb-6 z-20">
    <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-[#E8668A]' : 'text-gray-400'}`}>
      <Home className="w-6 h-6" /><span className="text-[10px] font-bold">홈</span>
    </button>
    <button onClick={() => showToast('마이룸 기능이 곧 업데이트 됩니다!')} className="flex flex-col items-center gap-1 text-gray-400">
      <User className="w-6 h-6" /><span className="text-[10px] font-medium">마이룸</span>
    </button>
    <button onClick={() => showToast('알림 기능이 곧 업데이트 됩니다!')} className="flex flex-col items-center gap-1 text-gray-400 relative">
      <Bell className="w-6 h-6" /><span className="absolute top-0 right-1 w-2 h-2 bg-[#F4A067] rounded-full border-2 border-white"></span>
      <span className="text-[10px] font-medium">알림</span>
    </button>
    <button onClick={() => showToast('설정 기능이 곧 업데이트 됩니다!')} className="flex flex-col items-center gap-1 text-gray-400">
      <Settings className="w-6 h-6" /><span className="text-[10px] font-medium">설정</span>
    </button>
  </nav>
);

// ==========================================
// [VIEWS] 화면별 모듈
// ==========================================

// 1. HOME VIEW (🔥 리스트 카드 클릭 시 투표 화면 이동 추가)
const HomeView = ({ setView, showToast, decisions, onSelectDecision }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <header className="px-6 pt-6 pb-2 bg-white shrink-0">
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Decision Flow</h1>
      </header>
      
      <main className="flex-1 px-6 pb-24 overflow-y-auto">
        <div className="flex justify-center mb-6 mt-2 h-24">
          {!imgError ? (
            <img src="/앱로고.jpg" alt="Logo" className="h-full w-auto object-contain mix-blend-multiply" onError={() => setImgError(true)} />
          ) : (
            <div className="h-full px-10 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 text-center">
              <span className="text-xs font-black text-gray-500 mb-1">앱로고.jpg</span>
              <span className="text-[10px] font-medium">업로드 필요</span>
            </div>
          )}
        </div>

        <section className="mb-8 relative">
          <div className="absolute inset-0 border-[3px] border-[#a8ff35] rounded-3xl animate-pulse shadow-[0_0_20px_rgba(168,255,53,0.6)]"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-5 border border-white">
            <div className="flex items-center gap-1.5 mb-4">
              <Zap className="w-4 h-4 text-[#8CB82D] fill-[#8CB82D]" />
              <h2 className="text-[11px] font-black text-[#8CB82D] uppercase tracking-widest">AI Auto Templates</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((tpl) => (
                <button key={tpl.id} onClick={() => showToast('준비중입니다. (추후 AI 자동생성 지원)')} className={`${tpl.bgColor} bg-opacity-60 p-3 rounded-xl flex items-center gap-3 active:scale-95 transition-all`}>
                  <div className="p-1.5 bg-white rounded-lg shadow-sm shrink-0">{tpl.icon}</div>
                  <span className="font-bold text-gray-800 text-[13px] truncate">{tpl.title}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <button onClick={() => setView('create')} className="w-full bg-gradient-to-br from-[#E8668A] to-[#F4A067] text-white rounded-2xl py-4 px-4 flex items-center justify-center gap-2 shadow-xl shadow-pink-100 mb-8 active:scale-[0.98] transition-transform">
          <PlusCircle className="w-6 h-6" />
          <span className="text-lg font-black tracking-tight">새 안건 만들기</span>
        </button>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Recent Decisions</h2>
          </div>
          
          {decisions.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-[24px] p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <p className="text-gray-400 text-sm font-bold mb-6">아직 참여하거나 만든 안건이 없어요.</p>
              <button onClick={() => setView('create')} className="w-full bg-gradient-to-br from-[#E8668A] to-[#F4A067] text-white px-5 py-3 rounded-xl text-sm font-black shadow-lg shadow-pink-100 active:scale-95 flex items-center justify-center gap-2">
                <PlusCircle className="w-4 h-4" /> 지금 바로 안건을 생성 해보세요
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 pb-2 scrollbar-hide">
              {decisions.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => onSelectDecision(item)} // 🔥 클릭 시 안건 선택 및 이동
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99] animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-pink-50 text-[#E8668A] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">{item.status}</span>
                    <div className="flex items-center text-gray-400 gap-1"><Clock className="w-3 h-3" /><span className="text-[11px] font-bold">{item.dDay}</span></div>
                  </div>
                  <h3 className="text-[16px] font-black text-gray-800 leading-snug mb-3">{item.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400"><Users className="w-3.5 h-3.5" /><span className="text-xs font-medium">{item.voters}명이 참여 중</span></div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

// 2. CREATE VIEW (기존과 동일)
const CreateView = ({ setView, onPublish }) => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [options, setOptions] = useState([{ id: '1', text: '', voteCount: 0 }, { id: '2', text: '', voteCount: 0 }]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    setDeadline(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  }, []);

  const addOption = (pId = null) => {
    let newId = '';
    if (!pId) {
      const roots = options.filter(o => !o.id.includes('-'));
      if (roots.length >= MAX_ROOT_NODES) return;
      newId = String((roots.length > 0 ? Math.max(...roots.map(o => parseInt(o.id))) : 0) + 1);
    } else {
      const depth = pId.split('-').length;
      if (depth >= MAX_DEPTH) return;
      const sibs = options.filter(o => o.id.startsWith(pId + '-') && o.id.split('-').length === depth + 1);
      if (sibs.length >= MAX_CHILDREN) return alert(`하위 선택지는 최대 ${MAX_CHILDREN}개입니다.`);
      newId = `${pId}-${(sibs.length > 0 ? Math.max(...sibs.map(o => parseInt(o.id.split('-').pop()))) : 0) + 1}`;
    }
    const newOpts = [...options, { id: newId, text: '', voteCount: 0 }].sort((a, b) => {
      const aP = a.id.split('-').map(Number), bP = b.id.split('-').map(Number);
      for(let i=0; i<Math.max(aP.length, bP.length); i++) {
        if (aP[i] === undefined) return -1; if (bP[i] === undefined) return 1;
        if (aP[i] !== bP[i]) return aP[i] - bP[i];
      }
      return 0;
    });
    setOptions(newOpts);
  };

  const rootNodesCount = options.filter(o => !o.id.includes('-')).length;

  return (
    <>
      <header className="px-4 py-5 bg-white border-b border-gray-100 flex items-center shrink-0 z-10">
        <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
        <h1 className="flex-1 text-center font-black text-lg mr-8">안건 만들기</h1>
      </header>
      <main className="flex-1 px-6 pt-6 pb-40 overflow-y-auto relative bg-gray-50/30">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">안건 제목</label>
              <span className={`text-[10px] font-black ${title.length >= 30 ? 'text-red-500' : 'text-gray-300'}`}>{title.length}/30</span>
            </div>
            <input type="text" maxLength={30} value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="예: 이번 워크샵 어디로 갈까요?" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#E8668A] outline-none font-bold text-gray-800 shadow-sm" />
          </div>
          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-4">선택지 구성 (최대 {MAX_DEPTH}단계)</label>
            <div className="space-y-3">
              {options.map((opt) => {
                const depth = opt.id.split('-').length;
                const canDelete = opt.id !== '1' && opt.id !== '2';
                return (
                  <div key={opt.id} className="flex gap-2 items-center">
                    {depth > 1 && <div style={{ width: `${(depth - 1) * 16}px` }} className="flex justify-end shrink-0"><CornerDownRight className="w-4 h-4 text-gray-300"/></div>}
                    <span className="font-black text-gray-400 text-[13px] shrink-0 min-w-[20px]">{opt.id}</span>
                    <div className="flex-1 relative flex items-center">
                      <input type="text" maxLength={20} value={opt.text} onChange={(e)=>setOptions(options.map(o=>o.id===opt.id?{...o, text:e.target.value}:o))} placeholder="선택지 입력" className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-[#E8668A] outline-none text-[14px] font-bold text-gray-700 shadow-sm" />
                      <span className={`absolute right-3 text-[10px] font-black ${opt.text.length >= 20 ? 'text-red-500' : 'text-gray-300'}`}>{opt.text.length}/20</span>
                    </div>
                    {depth < MAX_DEPTH && (
                      <button onClick={()=>addOption(opt.id)} className={`px-2.5 py-2 rounded-lg text-[10px] font-black whitespace-nowrap shrink-0 transition-all ${options.filter(o => o.id.startsWith(opt.id + '-') && o.id.split('-').length === depth+1).length >= MAX_CHILDREN ? 'text-gray-300 bg-gray-50' : 'text-[#E8668A] bg-pink-50'}`}>+ 하위</button>
                    )}
                    {canDelete ? (
                      <button onClick={()=>setOptions(options.filter(o=>!(o.id===opt.id || o.id.startsWith(opt.id+'-'))))} className="p-1.5 text-gray-300 hover:text-red-400"><X className="w-4 h-4" /></button>
                    ) : <div className="w-7 h-7 shrink-0"></div>}
                  </div>
                )
              })}
              {rootNodesCount < MAX_ROOT_NODES && (
                <button onClick={()=>addOption(null)} className="w-full py-4 mt-2 rounded-2xl border-2 border-dashed border-orange-200 text-[#F4A067] font-black text-sm hover:bg-orange-50 transition-colors">+ 선택지 추가</button>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">마감 기한 설정</label>
            <input type="datetime-local" value={deadline} onChange={(e)=>setDeadline(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#E8668A] outline-none font-bold text-gray-700 shadow-sm" />
          </div>
        </div>
      </main>
      <div className="absolute bottom-[76px] left-0 w-full px-6 pb-6 pt-10 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none z-10">
        <button onClick={()=>{
          const filled = options.filter(o=>o.text.trim()!=='');
          if (filled.length < 2) return setShowError(true);
          onPublish({ title, deadline, options: filled });
        }} className="w-full bg-gradient-to-r from-[#E8668A] to-[#F4A067] text-white rounded-2xl py-4 font-black shadow-xl pointer-events-auto active:scale-95 transition-all text-lg">의견모으기 시작</button>
      </div>
      {showError && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-8 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 w-full text-center shadow-2xl animate-in zoom-in duration-300">
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle className="w-10 h-10 text-red-400" /></div>
             <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">입력 내용을 확인해 주세요</h3>
             <p className="text-sm text-gray-500 mb-8 font-medium leading-relaxed">최소 2개 이상의 선택지가 필요합니다.</p>
             <button onClick={()=>setShowError(false)} className="w-full bg-gray-900 text-white rounded-2xl py-4 font-black active:scale-95 transition-all">다시 확인하기</button>
          </div>
        </div>
      )}
    </>
  );
};

// 🔥 3. [NEW] VOTE VIEW (참여자 투표 화면)
const VoteView = ({ decision, setView, onVoteSubmit }) => {
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);

  const rootOptions = decision.options.filter(o => !o.id.includes('-'));
  const childOptions = selectedParent 
    ? decision.options.filter(o => o.id.startsWith(selectedParent.id + '-') && o.id.split('-').length === 2)
    : [];

  const handleParentSelect = (opt) => {
    setSelectedParent(opt);
    setSelectedChild(null); // 부모가 바뀌면 자식 선택 초기화
  };

  const handleVote = () => {
    const finalChoiceId = selectedChild ? selectedChild.id : selectedParent.id;
    onVoteSubmit(decision.id, finalChoiceId);
  };

  return (
    <>
      <header className="px-4 py-5 bg-white border-b border-gray-100 flex items-center shrink-0 z-10">
        <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
        <h1 className="flex-1 text-center font-black text-lg mr-8 truncate px-2">{decision.title}</h1>
      </header>
      <main className="flex-1 px-6 pt-6 pb-40 overflow-y-auto bg-gray-50/30">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1 h-6 bg-[#E8668A] rounded-full"></div>
             <h2 className="text-xl font-black text-gray-900">어디로 갈까요?</h2>
          </div>
          <p className="text-sm text-gray-400 font-medium ml-3">원하는 항목을 선택해 주세요.</p>
        </div>

        {/* 1단계 선택지 (부모) */}
        <div className="space-y-3 mb-8">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Step 1. 대분류 선택</label>
          {rootOptions.map((opt) => (
            <button 
              key={opt.id}
              onClick={() => handleParentSelect(opt)}
              className={`w-full p-5 rounded-[20px] text-left transition-all duration-300 flex justify-between items-center border-2 ${
                selectedParent?.id === opt.id 
                ? 'bg-white border-[#B6FF33] shadow-[0_10px_20px_-5px_rgba(182,255,51,0.4)] scale-[1.02]' 
                : 'bg-white border-transparent shadow-sm hover:border-gray-100'
              }`}
            >
              <span className={`text-[16px] font-black ${selectedParent?.id === opt.id ? 'text-gray-900' : 'text-gray-500'}`}>{opt.text}</span>
              {selectedParent?.id === opt.id && <div className="w-6 h-6 bg-[#B6FF33] rounded-full flex items-center justify-center animate-in zoom-in duration-200"><Check className="w-4 h-4 text-[#2C4000]" /></div>}
            </button>
          ))}
        </div>

        {/* 2단계 선택지 (자식) - 부모가 선택되고 자식이 있을 때만 노출 */}
        {selectedParent && childOptions.length > 0 && (
          <div className="space-y-3 animate-in slide-in-from-top-4 fade-in duration-500">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Step 2. 상세 선택</label>
            <div className="grid grid-cols-1 gap-2">
              {childOptions.map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => setSelectedChild(opt)}
                  className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 border-2 ${
                    selectedChild?.id === opt.id 
                    ? 'bg-[#F9FFF0] border-[#B6FF33] text-[#2C4000]' 
                    : 'bg-white border-gray-50 text-gray-400'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${selectedChild?.id === opt.id ? 'bg-[#B6FF33]' : 'bg-gray-100'}`}></div>
                  <span className="text-[14px] font-bold">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 투표 제출 버튼 */}
      <div className="absolute bottom-[76px] left-0 w-full px-6 pb-6 pt-10 bg-gradient-to-t from-white via-white/90 to-transparent z-10">
        <button 
          disabled={!selectedParent || (childOptions.length > 0 && !selectedChild)}
          onClick={handleVote}
          className={`w-full rounded-2xl py-4 font-black shadow-xl transition-all text-lg ${
            (!selectedParent || (childOptions.length > 0 && !selectedChild))
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#E8668A] to-[#F4A067] text-white active:scale-95'
          }`}
        >
          투표 완료하기
        </button>
      </div>
    </>
  );
};

// 4. SUCCESS VIEW (기존과 동일)
const SuccessView = ({ setView }) => (
  <main className="flex-1 px-8 flex flex-col items-center justify-center text-center pb-24">
    <div className="w-24 h-24 bg-green-50 rounded-[40px] flex items-center justify-center mb-8 animate-bounce"><CheckCircle2 className="w-14 h-14 text-green-400" /></div>
    <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">안건 생성 완료!</h2>
    <p className="text-sm text-gray-400 mb-12 font-medium">참여자들에게 링크를 공유하여<br/>의사결정을 시작해보세요.</p>
    <div className="w-full space-y-4">
      <div className="bg-purple-50 p-5 rounded-3xl text-left border border-purple-100">
        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">방장 관리 링크</p>
        <div className="flex justify-between items-center"><code className="text-xs text-purple-600 font-bold truncate mr-4">admin/df-2026-auth-8f3a</code><Copy className="w-5 h-5 text-purple-300 cursor-pointer" /></div>
      </div>
      <div className="bg-gray-50 p-5 rounded-3xl text-left border border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">참여자 공유 링크</p>
        <div className="flex justify-between items-center"><code className="text-xs text-gray-500 font-bold truncate mr-4">vote/decision-flow-v1</code><Copy className="w-5 h-5 text-gray-300 cursor-pointer" /></div>
      </div>
    </div>
    <button onClick={()=>setView('home')} className="mt-16 text-gray-400 font-black text-sm border-b-2 border-gray-100 pb-1">홈으로 돌아가기</button>
  </main>
);

// ==========================================
// [ROOT] 메인 앱 컨테이너
// ==========================================
export default function App() {
  const [view, setView] = useState('home');
  const [toast, setToast] = useState(null);
  const [selectedDecision, setSelectedDecision] = useState(null);
  
  const [decisions, setDecisions] = useState(() => {
    const savedData = localStorage.getItem('decisionFlow_decisions');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.length > 0) return parsed;
    }
    return INITIAL_MOCK_DATA;
  });

  useEffect(() => {
    localStorage.setItem('decisionFlow_decisions', JSON.stringify(decisions));
  }, [decisions]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handlePublish = (decisionData) => {
    const newDecision = {
      id: Date.now(),
      title: decisionData.title || "제목 없는 안건",
      status: "진행중",
      dDay: "D-Day",
      voters: 0,
      options: decisionData.options,
    };
    setDecisions([newDecision, ...decisions]);
    setView('success');
  };

  // 🔥 [실행 모드] 투표 결과 반영 로직
  const handleVoteSubmit = (decisionId, optionId) => {
    const updatedDecisions = decisions.map(d => {
      if (d.id === decisionId) {
        const updatedOptions = d.options.map(o => {
          if (o.id === optionId) return { ...o, voteCount: (o.voteCount || 0) + 1 };
          return o;
        });
        return { ...d, voters: (d.voters || 0) + 1, options: updatedOptions };
      }
      return d;
    });
    setDecisions(updatedDecisions);
    showToast('투표가 성공적으로 반영되었습니다!');
    setView('home');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex justify-center items-center font-sans">
      <div className="w-full max-w-md bg-white h-[850px] max-h-screen relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
        {view === 'home' && (
          <HomeView 
            setView={setView} 
            showToast={showToast} 
            decisions={decisions} 
            onSelectDecision={(d) => { setSelectedDecision(d); setView('vote'); }} 
          />
        )}
        {view === 'create' && <CreateView setView={setView} onPublish={handlePublish} />}
        {view === 'vote' && selectedDecision && (
          <VoteView 
            decision={selectedDecision} 
            setView={setView} 
            onVoteSubmit={handleVoteSubmit} 
          />
        )}
        {view === 'success' && <SuccessView setView={setView} />}
        <BottomNav view={view} setView={setView} showToast={showToast} />
        <Toast message={toast} />
      </div>
    </div>
  );
}