import React, { useState, useEffect, useRef } from 'react';
import { AppState, Product, UserInput, AnalysisResult, Report } from './types';
import { PRODUCTS, ISSUES } from './constants';
import { generateAnalysis } from './services/geminiService';
import { Heart, Lock, ShieldCheck, CheckCircle2, ChevronRight, Upload, AlertCircle, LogOut, Download, Printer, ArrowRight, Activity, Zap, MessageCircle, Eye, RefreshCw, Layers, Calendar, Map, Flag, Info } from 'lucide-react';

// --- Components ---

const Header = ({ onNavigate, isLoggedIn, onLogout }: { onNavigate: (s: AppState) => void, isLoggedIn: boolean, onLogout: () => void }) => (
  <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-stone-200 print:hidden">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(AppState.LANDING)}>
        <Heart className="w-6 h-6 text-brand-600 fill-brand-600" />
        <span className="font-serif text-xl font-bold tracking-tight text-stone-900">LovePattern</span>
      </div>
      <nav className="flex gap-4 text-sm font-medium">
        {isLoggedIn ? (
          <>
            <button onClick={() => onNavigate(AppState.DASHBOARD)} className="text-stone-600 hover:text-brand-600">My Reports</button>
            <button onClick={onLogout} className="text-stone-600 hover:text-stone-900 flex items-center gap-1"><LogOut className="w-4 h-4"/> Sign Out</button>
          </>
        ) : (
          <button onClick={() => onNavigate(AppState.AUTH)} className="text-stone-600 hover:text-brand-600">Login</button>
        )}
      </nav>
    </div>
  </header>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, icon: Icon }: any) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-lg shadow-brand-200",
    secondary: "bg-white text-stone-900 border border-stone-200 hover:bg-stone-50 focus:ring-stone-200",
    outline: "border border-brand-600 text-brand-600 hover:bg-brand-50"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${(variants as any)[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

// --- Pages ---

const LandingPage = ({ onSelectProduct }: { onSelectProduct: (p: Product) => void }) => (
  <div className="flex flex-col min-h-screen">
    {/* Hero */}
    <section className="pt-20 pb-16 px-4 text-center bg-gradient-to-b from-brand-50 to-white">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center rounded-full bg-white border border-brand-100 px-3 py-1 text-xs font-medium text-brand-700 shadow-sm mb-4">
          <ShieldCheck className="w-3 h-3 mr-1" /> Scientific Relationship Analytics
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-tight">
          우리는 미래를 예언하지 않습니다.<br/>
          <span className="text-brand-600">당신의 패턴을 분석합니다.</span>
        </h1>
        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          왜 항상 같은 문제로 연애가 힘든지 궁금하신가요? <br className="hidden md:block"/>
          내면 데이터와 외부 인식 데이터를 교차 분석하여 구조적인 원인을 밝혀냅니다.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
            분석 시작하기
          </Button>
        </div>
      </div>
    </section>

    {/* Products */}
    <section id="products" className="py-20 px-4 container mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl font-bold text-stone-900 mb-4">지금 어떤 도움이 필요하신가요?</h2>
        <p className="text-stone-500">가장 고민되는 상황을 선택해주세요.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {PRODUCTS.map((product) => (
          <div key={product.id} className={`relative flex flex-col bg-white rounded-2xl border p-6 transition-all hover:shadow-xl ${product.badge ? 'border-brand-200 ring-4 ring-brand-50 shadow-brand-100' : 'border-stone-200 shadow-sm'}`}>
            {product.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {product.badge}
              </div>
            )}
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{product.title}</h3>
            <p className="text-sm text-stone-500 mb-4 min-h-[40px]">{product.description}</p>
            <div className="text-3xl font-bold text-stone-900 mb-6">${product.price}</div>
            
            <ul className="space-y-3 mb-8 flex-1">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-stone-600">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 mr-2 flex-shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button onClick={() => onSelectProduct(product)} variant={product.badge ? 'primary' : 'secondary'}>
              선택하기
            </Button>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const AuthPage = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-stone-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-stone-100">
        <h2 className="font-serif text-2xl font-bold text-center mb-6">LovePattern 시작하기</h2>
        <p className="text-center text-stone-500 mb-8">리포트를 안전하게 저장하기 위해 로그인해주세요.</p>
        <div className="space-y-4">
          <Button onClick={onComplete} className="w-full bg-blue-600 hover:bg-blue-700 shadow-blue-200">
            구글로 계속하기
          </Button>
          <input type="email" placeholder="이메일 주소" className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-brand-500 outline-none" />
          <Button onClick={onComplete} className="w-full">로그인</Button>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = ({ product, onPaid, onBack }: { product: Product, onPaid: () => void, onBack: () => void }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-stone-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full border border-stone-100">
        <h2 className="font-serif text-2xl font-bold mb-6">주문 요약</h2>
        <div className="flex justify-between items-center py-4 border-b border-stone-100 mb-6">
          <span className="font-medium text-stone-700">{product.title}</span>
          <span className="font-bold text-stone-900">${product.price}</span>
        </div>
        <Button onClick={onPaid} className="w-full h-12 text-lg">결제 및 분석 시작</Button>
        <p className="text-xs text-center text-stone-400 mt-4">일회성 결제입니다. 구독되지 않습니다.</p>
      </div>
    </div>
  );
};

const IntakeWizard = ({ onSubmit }: { onSubmit: (data: UserInput) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserInput>({
    issueType: '',
    birthDate: '',
    birthTime: '',
    gender: 'female',
    userPhoto: null
  });

  const handleNext = () => setStep(s => s + 1);
  
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="h-2 bg-stone-100 w-full">
          <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold">가장 큰 고민은 무엇인가요?</h2>
              <div className="space-y-3">
                {ISSUES.map((issue: any) => (
                  <label key={issue.id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.issueType === issue.label ? 'border-brand-500 bg-brand-50' : 'border-stone-200 hover:border-brand-200'}`}>
                    <input 
                      type="radio" 
                      name="issue" 
                      className="w-5 h-5 text-brand-600 focus:ring-brand-500"
                      checked={formData.issueType === issue.label}
                      onChange={() => setFormData({...formData, issueType: issue.label})}
                    />
                    <span className="ml-3 font-medium text-stone-700">{issue.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleNext} disabled={!formData.issueType}>다음 <ChevronRight className="w-4 h-4 ml-1"/></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold">기본 정보 입력</h2>
              <p className="text-stone-500 text-sm">내면 패턴 분석(사주 로직)에 사용됩니다.</p>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">생년월일</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    출생 시간 <span className="text-stone-400 font-normal">(선택사항)</span>
                  </label>
                  <input 
                    type="time" 
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.birthTime || ''}
                    onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                  />
                  <p className="text-xs text-stone-400 mt-1">* 시간을 모르면 비워두세요. 생년월일만으로도 분석이 가능합니다.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">성별</label>
                  <div className="flex gap-4">
                    {['female', 'male', 'other'].map(g => (
                      <button 
                        key={g}
                        onClick={() => setFormData({...formData, gender: g as any})}
                        className={`flex-1 py-3 border rounded-lg capitalize ${formData.gender === g ? 'bg-brand-600 text-white border-brand-600' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                      >
                        {g === 'female' ? '여성' : g === 'male' ? '남성' : '기타'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={() => setStep(s => s - 1)}>이전</Button>
                <Button onClick={handleNext} disabled={!formData.birthDate}>다음 <ChevronRight/></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold">외부 인식 분석</h2>
              <p className="text-stone-500 text-sm">본인의 얼굴 사진을 업로드해주세요. 타인이 나를 어떻게 인식하는지(관상 데이터) 분석합니다.</p>
              
              <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center hover:bg-stone-50 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  id="photo-upload" 
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({...formData, userPhoto: e.target.files[0]});
                    }
                  }}
                />
                <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                   {formData.userPhoto ? (
                     <div className="relative">
                       <img src={URL.createObjectURL(formData.userPhoto)} alt="Preview" className="w-32 h-32 object-cover rounded-full shadow-md mb-4" />
                       <div className="text-brand-600 font-medium">{formData.userPhoto.name}</div>
                       <div className="text-xs text-stone-400 mt-1">변경하려면 클릭하세요</div>
                     </div>
                   ) : (
                     <>
                        <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8" />
                        </div>
                        <span className="text-brand-600 font-bold text-lg mb-1">사진 업로드</span>
                     </>
                   )}
                </label>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={() => setStep(s => s - 1)}>이전</Button>
                <Button onClick={handleNext} disabled={!formData.userPhoto}>다음 <ChevronRight/></Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 text-center">
              <h2 className="font-serif text-2xl font-bold">분석 준비 완료</h2>
              <p className="text-stone-600">다음 주제에 대한 패턴 분석을 시작합니다:<br/> <span className="font-bold text-stone-900">"{formData.issueType}"</span></p>
              
              <div className="bg-brand-50 border border-brand-100 p-6 rounded-xl text-left space-y-3">
                 <div className="flex justify-between">
                    <span className="text-stone-500">생년월일:</span>
                    <span className="font-medium">{formData.birthDate}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-stone-500">출생 시간:</span>
                    <span className="font-medium">{formData.birthTime ? formData.birthTime : '모름 (가설 분석)'}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-stone-500">사진:</span>
                    <span className="font-medium">{formData.userPhoto?.name}</span>
                 </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={() => setStep(s => s - 1)}>이전</Button>
                <Button onClick={() => onSubmit(formData)} className="w-full ml-4">분석 리포트 생성</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProcessingPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4 text-center">
    <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-6"></div>
    <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">전문 분석 리포트 생성 중...</h2>
    <div className="space-y-2 text-stone-500 animate-pulse text-sm">
      <p>기질적 행동 변수 계산 중...</p>
      <p>관상학적 외부 인식 데이터 추출 중...</p>
      <p>반복 패턴의 구조적 원인 도출 중...</p>
      <p>10페이지 심층 리포트 생성 중...</p>
    </div>
  </div>
);

// --- Result Report Sheets ---

const PageContainer = ({ children, pageNum, className = "" }: { children: React.ReactNode, pageNum: number, className?: string }) => (
  <div className={`w-full max-w-[210mm] mx-auto bg-white shadow-2xl mb-8 print:shadow-none print:mb-0 print:break-after-page min-h-[297mm] relative ${className}`}>
    <div className="p-12 h-full flex flex-col">
       {/* Page Header */}
       <div className="flex justify-between items-center border-b-2 border-stone-900 pb-4 mb-8">
         <span className="font-serif font-bold text-stone-400 uppercase tracking-widest text-xs">Confidential Analysis</span>
         <span className="font-serif font-bold text-stone-900">LovePattern Report</span>
       </div>
       
       {/* Content */}
       <div className="flex-1">
         {children}
       </div>

       {/* Page Footer */}
       <div className="mt-auto pt-8 border-t border-stone-200 flex justify-between text-[10px] text-stone-400 font-medium">
         <span>Generated by LovePattern AI</span>
         <span>Page {pageNum} of 10</span>
       </div>
    </div>
  </div>
);

const ResultPage = ({ result, userPhotoUrl }: { result: AnalysisResult, userPhotoUrl: string }) => {
  // Use a specific ID for PDF generation to avoid React Ref issues with external libraries
  const REPORT_ID = "lovepattern-report-container";

  const handleDownloadPDF = () => {
    const element = document.getElementById(REPORT_ID);
    if (!element) return;
    
    // @ts-ignore
    if (window.html2pdf) {
      const opt = {
        margin: 0,
        filename: 'LovePattern_Full_Analysis.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 py-12">
      {/* Action Bar */}
      <div className="fixed bottom-8 right-8 z-50 flex gap-4 print:hidden">
        <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-brand-600 text-white px-6 py-4 rounded-full shadow-xl hover:bg-brand-700 transition-all font-bold">
           <Download className="w-5 h-5" /> PDF 리포트 다운로드
        </button>
      </div>

      <div className="text-center mb-8 print:hidden">
        <h2 className="font-serif text-2xl font-bold text-stone-900">분석이 완료되었습니다</h2>
        <p className="text-stone-500">총 10페이지의 심층 리포트가 생성되었습니다.</p>
      </div>

      {/* Report Content Wrapper */}
      <div id={REPORT_ID} className="print:w-full">
        
        {/* PAGE 1: Executive Summary */}
        <PageContainer pageNum={1}>
           <div className="h-full flex flex-col justify-center">
              <div className="mb-12">
                 <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-4 tracking-tight">
                   Relationship Pattern<br/>Analysis Report
                 </h1>
                 <div className="h-1 w-20 bg-brand-600 mb-6"></div>
                 <p className="text-stone-500 text-sm font-medium">본 리포트는 귀하의 내면 패턴과 외부 인식 패턴을<br/>교차 분석하여 구조적인 해결책을 제안합니다.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-12 text-sm border-t border-b border-stone-200 py-6">
                 <div>
                   <p className="font-bold text-stone-400 uppercase text-xs mb-1">Analysis Target</p>
                   <p className="font-serif text-lg text-stone-900">{result.executive_summary.analysis_target}</p>
                 </div>
                 <div>
                   <p className="font-bold text-stone-400 uppercase text-xs mb-1">Analysis Purpose</p>
                   <p className="font-serif text-lg text-stone-900">{result.executive_summary.purpose}</p>
                 </div>
              </div>

              <div className="bg-stone-50 p-8 border-l-4 border-stone-900 mb-8">
                 <h3 className="font-bold text-stone-900 uppercase tracking-wide mb-6 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Key Findings
                 </h3>
                 <div className="space-y-4">
                    {result.executive_summary.key_findings.map((finding, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="font-serif font-bold text-brand-600 text-xl">{String(i+1).padStart(2,'0')}</span>
                        <p className="text-stone-700 leading-relaxed font-medium">{finding}</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="text-sm text-stone-600 leading-relaxed bg-white p-6 rounded border border-stone-100 shadow-sm text-justify">
                <span className="font-bold text-stone-900 block mb-2 uppercase text-xs tracking-wider">Structural Summary</span>
                {result.executive_summary.structural_summary}
              </div>
           </div>
        </PageContainer>

        {/* PAGE 2: Foundation Layer */}
        <PageContainer pageNum={2}>
           <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">{result.foundation_layer.title}</h2>
           <div className="h-0.5 w-full bg-stone-100 mb-8"></div>
           
           <div className="space-y-8">
              <div className="bg-stone-900 text-white p-8 rounded-lg">
                <h4 className="font-bold text-stone-400 text-xs uppercase mb-4">Core Energy (Saju)</h4>
                <p className="text-lg font-serif leading-relaxed text-justify opacity-95">{result.foundation_layer.core_energy}</p>
              </div>

              <div className="space-y-6">
                 <div className="border-l-4 border-stone-300 pl-6 py-1">
                    <h4 className="font-bold text-stone-900 text-base mb-2">Emotional Baseline</h4>
                    <p className="text-stone-700 text-sm leading-relaxed text-justify">{result.foundation_layer.emotional_baseline}</p>
                 </div>
                 <div className="border-l-4 border-stone-300 pl-6 py-1">
                    <h4 className="font-bold text-stone-900 text-base mb-2">Decision Pattern</h4>
                    <p className="text-stone-700 text-sm leading-relaxed text-justify">{result.foundation_layer.decision_pattern}</p>
                 </div>
                 <div className="border-l-4 border-brand-500 pl-6 bg-brand-50 p-6 rounded-r-lg">
                    <h4 className="font-bold text-brand-900 text-base mb-2">Hidden Potential</h4>
                    <p className="text-brand-800 text-sm font-medium leading-relaxed text-justify">{result.foundation_layer.hidden_potential}</p>
                 </div>
              </div>
           </div>
        </PageContainer>

        {/* PAGE 3: Persona Layer (New) */}
        <PageContainer pageNum={3}>
           <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">{result.persona_layer.title}</h2>
           <div className="h-0.5 w-full bg-stone-100 mb-8"></div>

           <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-stone-200 shadow-lg">
                <img src={userPhotoUrl} alt="User Analysis" className="w-full h-full object-cover" />
              </div>
           </div>

           <div className="space-y-8">
             <div className="bg-white border border-stone-200 p-8 rounded-lg shadow-sm">
               <h4 className="font-bold text-stone-900 text-sm mb-4 flex items-center gap-2"><Eye className="w-4 h-4"/> Visual Analysis</h4>
               <p className="text-stone-700 text-sm leading-relaxed text-justify">{result.persona_layer.face_analysis_summary}</p>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div className="bg-stone-50 p-6 rounded-lg">
                   <h4 className="font-bold text-stone-500 text-xs uppercase mb-3">The Misunderstanding</h4>
                   <p className="text-stone-800 text-sm font-bold leading-relaxed">{result.persona_layer.misunderstanding_point}</p>
                </div>
                <div className="bg-stone-50 p-6 rounded-lg">
                   <h4 className="font-bold text-stone-500 text-xs uppercase mb-3">First Impression Impact</h4>
                   <p className="text-stone-800 text-sm leading-relaxed">{result.persona_layer.first_impression_impact}</p>
                </div>
             </div>

             <div className="bg-stone-900 text-stone-200 p-6 rounded-lg">
                <h4 className="font-bold text-white text-xs uppercase mb-3">Strategic Visual Adjustment</h4>
                <p className="text-sm leading-relaxed text-justify">{result.persona_layer.visual_strategy}</p>
             </div>
           </div>
        </PageContainer>

        {/* PAGE 4: Inflow Layer (New) */}
        <PageContainer pageNum={4}>
           <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">{result.inflow_layer.title}</h2>
           <div className="h-0.5 w-full bg-stone-100 mb-8"></div>
           
           <div className="space-y-8">
             <div className="bg-brand-50 border border-brand-200 p-8 rounded-lg text-center">
               <h4 className="font-bold text-brand-800 text-sm uppercase mb-4">Your Attraction Trigger</h4>
               <p className="font-serif text-lg text-brand-900 font-bold leading-relaxed">"{result.inflow_layer.attraction_trigger}"</p>
             </div>

             {/* Vertical Flow for deep content */}
             <div className="flex flex-col gap-6">
                <div className="p-6 bg-stone-50 rounded-lg border-l-4 border-stone-300">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600">1</div>
                      <span className="text-sm font-bold text-stone-500 uppercase">You Attract</span>
                   </div>
                   <div className="text-sm font-medium text-stone-900 leading-relaxed text-justify pl-8">{result.inflow_layer.partner_type_attracted}</div>
                </div>

                <div className="flex justify-center text-stone-300">
                   <ArrowRight className="w-6 h-6 rotate-90" />
                </div>

                <div className="p-6 bg-stone-50 rounded-lg border-l-4 border-stone-300">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600">2</div>
                      <span className="text-sm font-bold text-stone-500 uppercase">The Failure Point</span>
                   </div>
                   <div className="text-sm font-medium text-stone-900 leading-relaxed text-justify pl-8">{result.inflow_layer.why_it_fails}</div>
                </div>
             </div>

             <div className="border-l-4 border-stone-900 pl-8 py-4">
                <h4 className="font-bold text-stone-900 text-base mb-2">How to Break the Pattern</h4>
                <p className="text-stone-600 text-sm leading-relaxed text-justify">{result.inflow_layer.pattern_break_tip}</p>
             </div>
           </div>
        </PageContainer>

        {/* PAGE 5: Conflict Layer */}
        <PageContainer pageNum={5}>
           <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">{result.conflict_layer.title}</h2>
           <div className="h-0.5 w-full bg-stone-100 mb-8"></div>
           
           <div className="relative border-l-2 border-stone-200 pl-10 space-y-10 py-6">
              <div className="relative">
                 <div className="absolute -left-[49px] bg-white border-2 border-stone-300 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-stone-500">1</div>
                 <h4 className="font-bold text-stone-900 text-sm mb-2 uppercase tracking-wide">The Trigger</h4>
                 <p className="text-stone-700 text-sm leading-relaxed text-justify">{result.conflict_layer.trigger_point}</p>
              </div>
              <div className="relative">
                 <div className="absolute -left-[49px] bg-white border-2 border-stone-300 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-stone-500">2</div>
                 <h4 className="font-bold text-stone-900 text-sm mb-2 uppercase tracking-wide">Defense Mechanism (Auto-Pilot)</h4>
                 <p className="text-stone-700 text-sm leading-relaxed text-justify">{result.conflict_layer.defense_mechanism}</p>
              </div>
              <div className="relative">
                 <div className="absolute -left-[49px] bg-brand-500 border-2 border-brand-500 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-white">3</div>
                 <h4 className="font-bold text-brand-600 text-sm mb-2 uppercase tracking-wide">Escalation Pattern</h4>
                 <div className="text-stone-900 font-medium text-sm bg-brand-50 p-6 rounded-lg leading-relaxed text-justify border border-brand-100">{result.conflict_layer.escalation_pattern}</div>
              </div>
           </div>

           <div className="mt-10 bg-stone-900 text-white p-8 rounded-lg flex items-start gap-5">
              <RefreshCw className="w-6 h-6 mt-1 shrink-0 text-brand-400"/>
              <div>
                 <h4 className="font-bold text-sm mb-2 text-brand-400 uppercase tracking-wider">De-escalation Key</h4>
                 <p className="text-sm opacity-90 leading-relaxed text-justify">{result.conflict_layer.de_escalation_key}</p>
              </div>
           </div>
        </PageContainer>

        {/* PAGE 6: Shadow Layer (New) */}
        <PageContainer pageNum={6}>
           <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">{result.shadow_layer.title}</h2>
           <div className="h-0.5 w-full bg-stone-100 mb-8"></div>
           
           <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="bg-white border border-stone-200 p-6 rounded-lg text-center flex flex-col justify-center">
                 <div className="text-xs font-bold text-stone-400 uppercase mb-3">Conscious Desire</div>
                 <div className="text-3xl mb-3">😇</div>
                 <p className="font-serif text-stone-900 font-bold leading-tight">"{result.shadow_layer.conscious_desire}"</p>
              </div>
              <div className="bg-stone-900 text-white p-6 rounded-lg text-center shadow-xl flex flex-col justify-center">
                 <div className="text-xs font-bold text-stone-500 uppercase mb-3">Subconscious Craving</div>
                 <div className="text-3xl mb-3">😈</div>
                 <p className="font-serif text-white font-bold leading-tight">"{result.shadow_layer.subconscious_craving}"</p>
              </div>
           </div>

           <div className="space-y-8">
              <div className="border-l-4 border-stone-400 pl-6">
                 <h4 className="font-bold text-stone-900 text-base mb-2">How Shadow Manifests</h4>
                 <p className="text-stone-700 text-sm leading-relaxed text-justify">{result.shadow_layer.shadow_manifestation}</p>
              </div>
              <div className="border-l-4 border-brand-600 pl-6">
                 <h4 className="font-bold text-stone-900 text-base mb-2">Integration Advice</h4>
                 <p className="text-stone-700 text-sm leading-relaxed text-justify">{result.shadow_layer.integration_advice}</p>
              </div>
           </div>
        </PageContainer>

        {/* PAGE 7: Communication Layer */}
        <PageContainer pageNum={7}>
           <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">{result.communication_layer.title}</h2>
           <div className="h-0.5 w-full bg-stone-100 mb-8"></div>
           
           <div className="flex gap-6 mb-10">
              <div className="flex-1 bg-stone-50 p-6 rounded-lg">
                 <h4 className="font-bold text-stone-500 text-xs uppercase mb-3">My Output Filter</h4>
                 <p className="text-stone-900 font-bold text-sm leading-relaxed">{result.communication_layer.my_filter}</p>
              </div>
              <div className="flex-1 bg-stone-50 p-6 rounded-lg">
                 <h4 className="font-bold text-stone-500 text-xs uppercase mb-3">Listener Distortion</h4>
                 <p className="text-stone-900 font-bold text-sm leading-relaxed">{result.communication_layer.listener_distortion}</p>
              </div>
           </div>

           <h3 className="font-bold text-stone-900 uppercase text-xs tracking-wider border-b border-stone-200 pb-2 mb-6">Correction Examples</h3>
           <div className="space-y-6">
              {result.communication_layer.correction_examples.map((ex, i) => (
                 <div key={i} className="border border-stone-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex gap-4 items-center">
                       <span className="text-xs font-bold text-red-400 uppercase w-20 shrink-0">Original</span>
                       <span className="text-sm text-stone-600 line-through decoration-red-300">{ex.original}</span>
                    </div>
                    <div className="bg-white p-4 border-b border-stone-100 flex gap-4 items-center">
                       <span className="text-xs font-bold text-stone-400 uppercase w-20 shrink-0">Heard As</span>
                       <span className="text-sm text-stone-500 italic">"{ex.distortion}"</span>
                    </div>
                    <div className="bg-green-50 p-4 flex gap-4 items-center">
                       <span className="text-xs font-bold text-green-600 uppercase w-20 shrink-0">Correction</span>
                       <span className="text-sm text-stone-900 font-bold">{ex.correction}</span>
                    </div>
                 </div>
              ))}
           </div>
        </PageContainer>

        {/* PAGE 8: Timeline Layer (New) */}
        <PageContainer pageNum={8}>
           <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">{result.timeline_layer.title}</h2>
           <div className="h-0.5 w-full bg-stone-100 mb-8"></div>
           
           <div className="bg-stone-900 text-white rounded-xl p-8 text-center mb-8 shadow-xl">
              <Calendar className="w-10 h-10 mx-auto mb-4 text-brand-400"/>
              <h4 className="text-sm font-bold text-stone-400 uppercase mb-3">Current Relationship Season</h4>
              <p className="text-4xl font-serif font-bold text-brand-400 mb-6">{result.timeline_layer.current_season}</p>
              <p className="text-sm opacity-80 max-w-2xl mx-auto leading-relaxed">{result.timeline_layer.long_term_flow}</p>
           </div>

           <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                 <h4 className="font-bold text-yellow-700 text-sm mb-3 uppercase flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Caution Period</h4>
                 <p className="text-stone-800 text-sm leading-relaxed">{result.timeline_layer.caution_period}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                 <h4 className="font-bold text-blue-700 text-sm mb-3 uppercase flex items-center gap-2"><Zap className="w-4 h-4"/> Opportunity Window</h4>
                 <p className="text-stone-800 text-sm leading-relaxed">{result.timeline_layer.opportunity_window}</p>
              </div>
           </div>
        </PageContainer>

        {/* PAGE 9: Action Layer */}
        <PageContainer pageNum={9}>
           <h2 className="font-serif text-3xl font-bold text-stone-900 mb-6">{result.action_layer.title}</h2>
           
           <div className="mb-10">
             <h3 className="font-bold text-stone-900 uppercase text-xs tracking-wider border-b border-stone-200 pb-2 mb-4">Immediate Tactics</h3>
             <ul className="space-y-3">
               {result.action_layer.immediate_fixes.map((pt, i) => (
                 <li key={i} className="flex gap-4 text-stone-800 text-sm font-medium bg-stone-50 p-4 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{pt}</span>
                 </li>
               ))}
             </ul>
           </div>

           <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                 <h4 className="font-bold text-red-600 text-xs uppercase mb-4 flex items-center gap-2"><Flag className="w-4 h-4"/> Red Flags (Stop)</h4>
                 <ul className="space-y-3">
                    {result.action_layer.red_flags.map((flag, i) => (
                       <li key={i} className="text-xs text-stone-800 list-disc list-inside leading-relaxed">{flag}</li>
                    ))}
                 </ul>
              </div>
              <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                 <h4 className="font-bold text-green-600 text-xs uppercase mb-4 flex items-center gap-2"><Flag className="w-4 h-4"/> Green Flags (Go)</h4>
                 <ul className="space-y-3">
                    {result.action_layer.green_flags.map((flag, i) => (
                       <li key={i} className="text-xs text-stone-800 list-disc list-inside leading-relaxed">{flag}</li>
                    ))}
                 </ul>
              </div>
           </div>

           <div className="space-y-4">
               <h3 className="font-bold text-stone-900 uppercase text-xs tracking-wider border-b border-stone-200 pb-2 mb-4">Emergency Scripts</h3>
               {result.action_layer.scripts.map((script, i) => (
                 <div key={i} className="flex gap-4 items-start">
                    <span className="text-[10px] font-bold text-stone-400 uppercase w-24 shrink-0 text-right pt-2">{script.situation}</span>
                    <div className="flex-1 bg-white border border-stone-200 p-4 rounded-lg text-sm italic text-stone-800 shadow-sm leading-relaxed">"{script.script}"</div>
                 </div>
               ))}
           </div>
        </PageContainer>

        {/* PAGE 10: Roadmap Layer (New) */}
        <PageContainer pageNum={10}>
           <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">{result.roadmap_layer.title}</h2>
           <div className="h-0.5 w-full bg-stone-100 mb-12"></div>
           
           <div className="space-y-0 relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-stone-200"></div>

              <div className="relative pl-20 pb-12">
                 <div className="absolute left-0 w-12 h-12 bg-white border-2 border-stone-300 rounded-full flex items-center justify-center font-bold text-stone-400 z-10 shadow-sm">1</div>
                 <h4 className="font-bold text-xl text-stone-900 mb-3">Phase 1: Awareness</h4>
                 <p className="text-stone-700 text-sm leading-loose text-justify">{result.roadmap_layer.phase_1_awareness}</p>
              </div>

              <div className="relative pl-20 pb-12">
                 <div className="absolute left-0 w-12 h-12 bg-brand-50 border-2 border-brand-500 rounded-full flex items-center justify-center font-bold text-brand-600 z-10 shadow-sm">2</div>
                 <h4 className="font-bold text-xl text-stone-900 mb-3">Phase 2: Calibration</h4>
                 <p className="text-stone-700 text-sm leading-loose text-justify">{result.roadmap_layer.phase_2_calibration}</p>
              </div>

              <div className="relative pl-20 pb-8">
                 <div className="absolute left-0 w-12 h-12 bg-stone-900 border-2 border-stone-900 rounded-full flex items-center justify-center font-bold text-white z-10 shadow-sm">3</div>
                 <h4 className="font-bold text-xl text-stone-900 mb-3">Phase 3: Mastery</h4>
                 <p className="text-stone-700 text-sm leading-loose text-justify">{result.roadmap_layer.phase_3_mastery}</p>
              </div>
           </div>

           <div className="mt-16 p-10 bg-stone-50 border-t-4 border-brand-600 rounded-xl text-center shadow-lg">
              <h4 className="font-serif text-2xl font-bold text-stone-900 mb-6">Final Message</h4>
              <p className="text-stone-600 italic leading-relaxed text-lg">"{result.roadmap_layer.final_message}"</p>
           </div>
        </PageContainer>
      </div>
    </div>
  );
};

// --- Main App Logic ---

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>(AppState.LANDING);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Report | null>(null);

  const navigate = (state: AppState) => {
    window.scrollTo(0,0);
    setCurrentState(state);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    if (!isLoggedIn) {
      navigate(AppState.AUTH);
    } else {
      navigate(AppState.PAYMENT);
    }
  };

  const handleAuthComplete = () => {
    setIsLoggedIn(true);
    if (selectedProduct) {
      navigate(AppState.PAYMENT);
    } else {
      navigate(AppState.DASHBOARD);
    }
  };

  const handlePaymentComplete = () => {
    navigate(AppState.INTAKE);
  };

  const handleAnalysisSubmit = async (data: UserInput) => {
    navigate(AppState.PROCESSING);
    
    try {
      const result = await generateAnalysis(data);
      let photoUrl = '';
      if (data.userPhoto) {
         photoUrl = URL.createObjectURL(data.userPhoto);
      }
      const report: Report = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        productTitle: selectedProduct?.title || 'Custom Analysis',
        result: result,
        userPhotoUrl: photoUrl
      };
      setAnalysisResult(report);
      navigate(AppState.RESULT);

    } catch (error) {
      console.error(error);
      alert("분석 생성 중 오류가 발생했습니다. API Key를 확인하거나 다시 시도해주세요.");
      navigate(AppState.INTAKE);
    }
  };

  return (
    <div className="font-sans text-stone-900 bg-stone-50 min-h-screen">
      <Header onNavigate={navigate} isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
      <main>
        {currentState === AppState.LANDING && <LandingPage onSelectProduct={handleProductSelect} />}
        {currentState === AppState.AUTH && <AuthPage onComplete={handleAuthComplete} />}
        {currentState === AppState.PAYMENT && selectedProduct && (
          <PaymentPage product={selectedProduct} onPaid={handlePaymentComplete} onBack={() => navigate(AppState.LANDING)} />
        )}
        {currentState === AppState.INTAKE && <IntakeWizard onSubmit={handleAnalysisSubmit} />}
        {currentState === AppState.PROCESSING && <ProcessingPage />}
        {currentState === AppState.RESULT && analysisResult && (
          <ResultPage result={analysisResult.result} userPhotoUrl={analysisResult.userPhotoUrl} />
        )}
        {currentState === AppState.DASHBOARD && (
          <div className="p-8 text-center min-h-screen">
            <h2 className="text-2xl font-serif font-bold mb-4">내 리포트 보관함</h2>
            {analysisResult ? (
              <Button onClick={() => navigate(AppState.RESULT)}>최근 리포트 보기</Button>
            ) : (
              <p>아직 생성된 리포트가 없습니다.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}