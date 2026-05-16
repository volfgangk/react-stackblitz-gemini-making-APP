import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, Home, User, Bell, Settings, FileText, Zap, 
  Calendar, Coffee, Users, X, ChevronLeft, 
  CheckCircle2, Copy, CornerDownRight, AlertCircle, Clock, Check
} from 'lucide-react';

// ==========================================
// [CTO CONFIG] 5-2-2 명칭 및 제약 조건 설정
// ==========================================
const MAX_ROOT_NODES = 5;       // 최상위 노드 (부모 노드) 최대 5개
const MAX_CHILD_PER_NODE = 2;    // 하위/차하위 노드 (자식 노드) 최대 2개
const MAX_DEPTH = 3;            // 최대 3뎁스 (부모 -> 자식 1뎁스 -> 자식 2뎁스)

const TEMPLATES = [
  { id: 1, title: '팀 회식', icon: <Coffee className="w-4 h-4 text-pink-500" />, bgColor: 'bg-[#FFD6E0]' },
  { id: 2, title: '프로젝트명', icon: <Zap className="w-4 h-4 text-orange-500" />, bgColor: 'bg-[#FFE4B5]' },
  { id: 3, title: '워크샵 일정', icon: <Calendar className="w-4 h-4 text-purple-500" />, bgColor: 'bg-[#E6D7FF]' },
  { id: 4, title: '회의 개선', icon: <Users className="w-4 h-4 text-pink-500" />, bgColor: 'bg-[#FFD6E0]' },
];

const INITIAL_MOCK_DATA = [
  {
    id: 10001,
    title: "🔥 2026 하반기 팀 워크샵 장소 정하기 (테스트 안건1)",
    status: "진행중",
    dDay: "D-2",
    voters: 8,
    options: [
      { id: '1', text: '제주도 (푸른 바다와 맛있는 해산물이 가득한 섬)', voteCount: 5 },
      { id: '1-1', text: '함덕 해변 근처 (최고의 힐링 장소)', voteCount: 2 },
      { id: '1-1-1', text: '서우봉 둘레길 오후 산책 코스 탐방', voteCount: 1 },
      { id: '1-1-2', text: '해변 앞 유명 카페 델문도 단체 방문', voteCount: 1 },
      { id: '1-2', text: '서귀포 숲속 산장 (깊은 대화 가능)', voteCount: 3 },
      { id: '1-2-1', text: '산장 야외 바베큐 파티 및 불멍 캠핑', voteCount: 2 },
      { id: '1-2-2', text: '아침 편백나무 숲길 피톤치드 명상', voteCount: 1 },
      { id: '2', text: '강릉/속초 (시원한 파도와 커피 거리가 있는 동해안)', voteCount: 3 },
      { id: '2-1', text: '안목해변 커피거리 정복 코스', voteCount: 2 },
      { id: '2-1-1', text: '로컬 유명 로스팅 카페 바리스타 체험', voteCount: 2 },
      { id: '2-1-2', text: '해변 오션뷰 테라스 브런치 타임', voteCount: 0 },
      { id: '2-2', text: '설악산 조용한 힐링 펜션 단지', voteCount: 1 },
      { id: '2-2-1', text: '흔들바위 가벼운 오전 등산 코스', voteCount: 1 },
      { id: '2-2-2', text: '계곡 토종닭 백숙 몸보신 만찬', voteCount: 0 }
    ]
  },
  {
    id: 10002,
    title: "✨ 신규 서비스 로고 시안 투표 (테스트 안건2)",
    status: "진행중",
    dDay: "D-5",
    voters: 4,
    options: [
      { id: '1', text: 'A안 (모던하고 심플한 미니멀리즘 그래픽 디자인)', voteCount: 2 },
      { id: '1-1', text: '심플 라인 타이포그래피 융합 타입', voteCount: 1 },
      { id: '1-1-1', text: '블랙 & 화이트 모노톤 다크모드 시안', voteCount: 1 },
      { id: '1-1-2', text: '네온 그린 포인트 컬러 하이라이트 시안', voteCount: 0 },
      { id: '1-2', text: '볼드 솔리드 인클로저 타입', voteCount: 1 },
      { id: '1-2-1', text: '앱 아이콘 최적화 스퀘어 시안', voteCount: 1 },
      { id: '1-2-2', text: '라운드 서클 엠블럼 심볼 시안', voteCount: 0 },
      { id: '2', text: 'B안 (전통과 신뢰를 강조한 클래식 심볼릭 디자인)', voteCount: 2 },
      { id: '2-1', text: '그라데이션 입체 볼륨 타입', voteCount: 1 },
      { id: '2-1-1', text: '파스텔 마블링 소프트 그라데이션', voteCount: 1 },
      { id: '2-1-2', text: '메탈릭 실버 크롬 하이테크 그라데이션', voteCount: 0 },
      { id: '2-2', text: '시그니처 타이포그래피 혼합형', voteCount: 1 },
      { id: '2-2-1', text: '세리프 클래식 서체 명조 계열 결합', voteCount: 1 },
      { id: '2-2-2', text: '산세리프 모던 서체 고딕 계열 결합', voteCount: 0 }
    ]
  }
];
// ==========================================
// [COMPONENTS] UI 공통 부품 (복구 완료)
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
// [VIEWS] 화면별 모듈 (1. 홈 화면)
// ==========================================
const HomeView = ({ setView, showToast, decisions, onSelectId }) => {
  return (
    <>
      <header className="px-6 pt-6 pb-2 bg-white shrink-0">
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Decision Flow</h1>
      </header>
      
      <main className="flex-1 px-6 pb-24 overflow-y-auto">
        <div className="flex justify-center mb-6 mt-2 h-24">
          <img src="/앱로고.jpg" alt="Logo" className="h-full w-auto object-contain mix-blend-multiply" onError={(e) => e.target.style.display='none'} />
        </div>

        {/* AI 자동 템플릿 영역 완벽 복구 */}
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
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 pb-2 scrollbar-hide">
            {decisions.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onSelectId(item.id)} 
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99]"
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
        </section>
      </main>
    </>
  );
};

// ==========================================
// [VIEWS] 화면별 모듈 (2. 안건 생성 화면)
// ==========================================
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
      if (sibs.length >= MAX_CHILD_PER_NODE) return;
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
      <header className="px-4 py-5 bg-white border-b border-gray-100 flex items-center shrink-0">
        <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
        <h1 className="flex-1 text-center font-black text-lg mr-8">안건 만들기</h1>
      </header>
      
      <main className="flex-1 px-6 pt-6 pb-40 overflow-y-auto bg-gray-50/30">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">안건 제목</label>
              <span className={`text-[10px] font-black ${title.length >= 30 ? 'text-red-500' : 'text-gray-300'}`}>{title.length}/30</span>
            </div>
            <input type="text" maxLength={30} value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="예: 이번 워크샵 어디로 갈까요?" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#E8668A] outline-none font-bold text-gray-800 shadow-sm" />
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-4">선택지 구성 (5-2-2 가이드 잠금)</label>
            <div className="space-y-3">
              {options.map((opt) => {
                const depth = opt.id.split('-').length;
                const childCount = options.filter(o => o.id.startsWith(opt.id + '-') && o.id.split('-').length === depth + 1).length;
                
                // 1번과 2번 부모 노드는 삭제 불가능한 필수 항목으로 잠금
                const isMandatoryRoot = depth === 1 && (opt.id === '1' || opt.id === '2');

                return (
                  <div key={opt.id} className="flex gap-2 items-center">
                    {depth > 1 && <CornerDownRight className="w-4 h-4 text-gray-300 ml-2 animate-in fade-in" style={{marginLeft: (depth-1)*14+'px'}} />}
                    <span className="font-black text-gray-400 text-[13px] shrink-0 min-w-[20px]">{opt.id}.</span>
                    <input type="text" value={opt.text} onChange={(e)=>setOptions(options.map(o=>o.id===opt.id?{...o, text:e.target.value}:o))} placeholder="내용 입력" className="flex-1 px-4 py-3 rounded-xl border border-gray-100 text-sm font-bold focus:ring-1 focus:ring-[#E8668A] outline-none bg-white shadow-sm" />
                    
                    {depth < MAX_DEPTH && (
                      <button 
                        type="button"
                        onClick={()=>addOption(opt.id)} 
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-black shrink-0 transition-all ${childCount >= MAX_CHILD_PER_NODE ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-pink-50 text-[#E8668A]'}`}
                      >
                        {childCount >= MAX_CHILD_PER_NODE ? '최대' : '+하위'}
                      </button>
                    )}
                    
                    {/* 필수 노드가 아닐 때만 X 버튼 노출 */}
                    {!isMandatoryRoot ? (
                      <button type="button" onClick={()=>setOptions(options.filter(o=>!(o.id===opt.id || o.id.startsWith(opt.id+'-'))))} className="text-gray-300 hover:text-red-400 p-1"><X className="w-4 h-4" /></button>
                    ) : (
                      <div className="w-6 h-6 shrink-0"></div>
                    )}
                  </div>
                )
              })}

              <button 
                type="button"
                onClick={()=>addOption(null)} 
                className={`w-full py-4 border-2 border-dashed rounded-2xl font-black text-sm transition-all ${rootNodesCount >= MAX_ROOT_NODES ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50' : 'border-orange-200 text-[#F4A067] hover:bg-orange-50'}`}
              >
                {rootNodesCount >= MAX_ROOT_NODES ? '부모 노드 생성 제한 (최대 5개)' : '+ 선택지 추가'}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">마감 기한 설정</label>
            <input type="datetime-local" value={deadline} onChange={(e)=>setDeadline(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#E8668A] outline-none font-bold text-gray-700 shadow-sm bg-white" />
          </div>
        </div>
      </main>

      <div className="absolute bottom-[76px] left-0 w-full px-6 pb-6 pt-10 bg-gradient-to-t from-white via-white/90 to-transparent z-10 pointer-events-none">
        <button 
          type="button"
          onClick={()=>{
            const filled = options.filter(o=>o.text.trim()!=='');
            if (filled.length < 2) return setShowError(true);
            onPublish({ title, options: filled });
          }} 
          className="w-full bg-gradient-to-r from-[#E8668A] to-[#F4A067] text-white rounded-2xl py-4 font-black shadow-xl pointer-events-auto active:scale-95 transition-all text-lg"
        >
          의견모으기 시작
        </button>
      </div>

      {showError && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-8 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 w-full text-center shadow-2xl animate-in zoom-in duration-300">
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle className="w-10 h-10 text-red-400" /></div>
             <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">입력 내용을 확인해 주세요</h3>
             <p className="text-sm text-gray-500 mb-8 font-medium leading-relaxed">최소 2개 이상의 유효한 선택지가 필요합니다.</p>
             <button type="button" onClick={()=>setShowError(false)} className="w-full bg-gray-900 text-white rounded-2xl py-4 font-black active:scale-95 transition-all">다시 확인하기</button>
          </div>
        </div>
      )}
    </>
  );
};

// ==========================================
// [VIEWS] 화면별 모듈 (3. 투표 참여 화면)
// ==========================================
const VoteView = ({ decision, setView, onVoteSubmit }) => {
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const handleVote = () => {
    if (selectedOptionId) {
      onVoteSubmit(decision.id, selectedOptionId);
    }
  };

  const isLeafNode = (id) => {
    return !decision.options.some(o => o.id.startsWith(id + '-'));
  };

  const rootOptions = decision.options.filter(o => !o.id.includes('-'));
  const getChildren = (parentId, depth) => decision.options.filter(o => o.id.startsWith(parentId + '-') && o.id.split('-').length === depth);

  return (
    <>
      {/* 상단 헤더 깔끔하게 정리 (배지 제거 및 여백 최적화) */}
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center shrink-0">
        <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
        <h1 className="flex-1 text-center font-black text-base text-gray-900 truncate mr-8">{decision.title}</h1>
      </header>
      
      {/* 상단 패딩 축소 (pt-5 -> pt-3.5) */}
      <main className="flex-1 px-5 pt-3.5 pb-40 overflow-y-auto bg-gray-100/50">
        
        {/* 투표 진행중 배지를 옵션1의 왼쪽 시작 라인에 맞춰 자동 정렬 */}
        <div className="mb-3 flex justify-start">
          <div className="inline-flex items-center gap-1.5 bg-pink-50 border border-pink-100 px-2.5 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 bg-[#E8668A] rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-[#E8668A] uppercase tracking-wider">투표 진행중</span>
          </div>
        </div>

        <div className="space-y-3">
          {rootOptions.map((parent) => {
            const l1Children = getChildren(parent.id, 2);
            const isParentLeaf = isLeafNode(parent.id);
            const isSelected = selectedOptionId === parent.id;

            return (
              <div key={parent.id} className="flex flex-col gap-1.5 bg-gray-200/40 border border-gray-200/60 rounded-[32px] p-3 transition-all">
                
                {isParentLeaf ? (
                  <button 
                    onClick={() => setSelectedOptionId(parent.id)} 
                    className={`w-full p-4 rounded-2xl text-left transition-all border-2 flex justify-between items-start ${isSelected ? 'bg-white border-[#B6FF33] shadow-[0_10px_20px_-5px_rgba(182,255,51,0.3)]' : 'bg-white border-gray-100 shadow-sm'}`}
                  >
                    <div className="flex gap-2 flex-1 mr-2 overflow-hidden">
                      <span className="text-[15px] font-black text-[#E8668A] shrink-0">{parent.id}.</span>
                      <span className="text-[15px] font-black text-gray-800 break-words">{parent.text}</span>
                    </div>
                    {isSelected && <div className="w-5 h-5 bg-[#B6FF33] rounded-full flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5 text-[#2C4000]" /></div>}
                  </button>
                ) : (
                  <div className="w-full px-4 py-2 flex justify-between items-start">
                    <div className="flex gap-2 flex-1 mr-2 overflow-hidden">
                      <span className="text-[14px] font-black text-gray-400 shrink-0">{parent.id}.</span>
                      <span className="text-[14px] font-black text-gray-500 break-words">{parent.text}</span>
                    </div>
                  </div>
                )}

                {l1Children.map(l1 => {
                  const l2Children = getChildren(l1.id, 3);
                  const isL1Leaf = isLeafNode(l1.id);
                  const isL1Selected = selectedOptionId === l1.id;

                  return (
                    <div key={l1.id} className="space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                      {isL1Leaf ? (
                        <button 
                          onClick={() => setSelectedOptionId(l1.id)} 
                          className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-start gap-3 border-2 ${isL1Selected ? 'bg-white border-[#B6FF33] shadow-[0_10px_20px_-5px_rgba(182,255,51,0.3)]' : 'bg-white border-gray-100 shadow-sm'}`}
                        >
                          <CornerDownRight className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                          <div className="flex gap-2 flex-1 overflow-hidden">
                            <span className="text-[14px] font-black text-[#F4A067] shrink-0">{l1.id}.</span>
                            <span className="text-[14px] font-bold text-gray-800 break-words">{l1.text}</span>
                          </div>
                          {isL1Selected && <div className="w-5 h-5 bg-[#B6FF33] rounded-full flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5 text-[#2C4000]" /></div>}
                        </button>
                      ) : (
                        <div className="w-full px-4 py-1.5 flex items-start gap-3">
                          <CornerDownRight className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                          <div className="flex gap-2 flex-1 overflow-hidden">
                            <span className="text-[13px] font-black text-gray-400 shrink-0">{l1.id}.</span>
                            <span className="text-[13px] font-black text-gray-500 break-words">{l1.text}</span>
                          </div>
                        </div>
                      )}

                      {l2Children.map(l2 => {
                        const isL2Selected = selectedOptionId === l2.id;
                        return (
                          <button 
                            key={l2.id} 
                            onClick={() => setSelectedOptionId(l2.id)} 
                            className={`w-full p-3 ml-6 rounded-xl text-left transition-all flex items-start gap-3 border-2 ${isL2Selected ? 'bg-white border-[#B6FF33] shadow-[0_10px_20px_-5px_rgba(182,255,51,0.3)]' : 'bg-white border-gray-100 shadow-sm'}`} 
                            style={{width: 'calc(100% - 24px)'}}
                          >
                            <CornerDownRight className="w-3.5 h-3.5 text-gray-200 shrink-0 mt-0.5" />
                            <div className="flex gap-2 flex-1 overflow-hidden">
                              <span className="text-[12px] font-black text-[#8CB82D] shrink-0">{l2.id}.</span>
                              <span className="text-[12px] font-bold text-gray-700 break-words">{l2.text}</span>
                            </div>
                            {isL2Selected && <div className="w-4 h-4 bg-[#B6FF33] rounded-full flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-[#2C4000]" /></div>}
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            );
          })}
        </div>
      </main>

      <div className="absolute bottom-[76px] left-0 w-full px-6 pb-6 pt-10 bg-gradient-to-t from-white via-white/90 to-transparent z-10">
        <button 
          disabled={!selectedOptionId}
          onClick={handleVote}
          className={`w-full rounded-2xl py-4 font-black shadow-xl transition-all text-lg ${!selectedOptionId ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-[#E8668A] to-[#F4A067] text-white active:scale-95'}`}
        >
          투표 완료하기
        </button>
      </div>
    </>
  );
};

// ==========================================
// [VIEWS] 화면별 모듈 (4. 생성 완료 성공 화면)
// ==========================================
const SuccessView = ({ setView }) => (
  <main className="flex-1 px-8 flex flex-col items-center justify-center text-center pb-24">
    <div className="w-24 h-24 bg-green-50 rounded-[40px] flex items-center justify-center mb-8 animate-bounce"><CheckCircle2 className="w-14 h-14 text-green-400" /></div>
    <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">안건 생성 완료!</h2>
    <p className="text-sm text-gray-400 mb-12 font-medium">참여자들에게 링크를 공유하여<br/>의사결정을 시작해보세요.</p>
    
    {/* 관리 링크 및 공유 링크 레이아웃 완벽 복구 */}
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
// [ROOT] 메인 앱 글로벌 컨테이너
// ==========================================
export default function App() {
  const [view, setView] = useState('home');
  const [toast, setToast] = useState(null);
  const [selectedDecisionId, setSelectedDecisionId] = useState(null);
  
  const [decisions, setDecisions] = useState(() => {
    const saved = localStorage.getItem('decisionFlow_decisions');
    return (saved && JSON.parse(saved).length > 0) ? JSON.parse(saved) : INITIAL_MOCK_DATA;
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

  const handleVoteSubmit = (decisionId, optionId) => {
    const updated = decisions.map(d => {
      if (d.id === decisionId) {
        const opts = d.options.map(o => o.id === optionId ? { ...o, voteCount: (o.voteCount || 0) + 1 } : o);
        return { ...d, voters: (d.voters || 0) + 1, options: opts };
      }
      return d;
    });
    setDecisions(updated);
    showToast('투표가 반영되었습니다!');
    setView('home');
  };

  const currentSelectedDecision = decisions.find(d => d.id === selectedDecisionId);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex justify-center items-center font-sans">
      <div className="w-full max-w-md bg-white h-[850px] max-h-screen relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
        {view === 'home' && (
          <HomeView 
            setView={setView} 
            showToast={showToast}
            decisions={decisions} 
            onSelectId={(id)=>{setSelectedDecisionId(id); setView('vote');}} 
          />
        )}
        {view === 'create' && <CreateView setView={setView} onPublish={handlePublish} />}
        {view === 'vote' && currentSelectedDecision && (
          <VoteView 
            decision={currentSelectedDecision} 
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