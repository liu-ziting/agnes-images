import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Image as ImageIcon, Zap, RefreshCw, ChevronRight, X, Maximize2, Link as LinkIcon, Clock, Download } from 'lucide-react';

type Tab = 'generate' | 'modify';

interface HistoryItem {
  id: string;
  url: string;
  prompt: string;
  type: 'generate' | 'modify';
  timestamp: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [prompt, setPrompt] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState('1024x1024');
  const [baseImageUrl, setBaseImageUrl] = useState('');
  const [historyImages, setHistoryImages] = useState<HistoryItem[]>([]);
  const [modifyChange, setModifyChange] = useState('');
  const [modifyKeep, setModifyKeep] = useState('the original composition and main subject layout');
  const [fullscreenItem, setFullscreenItem] = useState<HistoryItem | null>(null);

  // Configuration Hardcoded
  const API_URL = 'https://agnes-api.lz-t.top';
  const TEXT_MODEL = 'agnes-2.0-flash';
  const IMAGE_MODEL = 'agnes-image-2.1-flash';

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `agnes-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, '_blank');
    }
  };

  const handleOptimize = async () => {
    if (!prompt) return;
    setIsOptimizing(true);
    try {
      const response = await fetch(`${API_URL}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          model: TEXT_MODEL,
          messages: [
            { 
              role: 'system', 
              content: 'You are an expert midjourney prompt engineer. Your job is to take a simple concept and expand it into a highly detailed, cinematic, and evocative image generation prompt. Output ONLY the optimized prompt text without any introductory words.'
            },
            { role: 'user', content: prompt }
          ]
        })
      });
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setPrompt(data.choices[0].message.content.trim());
      } else {
        throw new Error(data.error?.message || "Unknown API Error");
      }
    } catch (error) {
      console.error("Optimization failed:", error);
      alert(`Optimization Error: ${(error as Error).message}`);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_URL}/v1/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: IMAGE_MODEL,
          prompt: prompt,
          size: imageSize
        })
      });
      const data = await response.json();
      if (data.data && data.data[0] && data.data[0].url) {
        const newImageUrl = data.data[0].url;
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          url: newImageUrl,
          prompt: prompt,
          type: 'generate',
          timestamp: Date.now()
        };
        setGeneratedImage(newImageUrl);
        setHistoryImages(prev => [newItem, ...prev]);
        setBaseImageUrl(newImageUrl); // Set as default for next modification
      } else {
        throw new Error(data.error?.message || "Unknown API Error");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert(`Generation Error: ${(error as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModify = async () => {
    if (!baseImageUrl || !modifyChange) return;
    setIsGenerating(true);
    
    // Construct best-practice prompt for img2img
    const finalModifyPrompt = modifyKeep.trim() 
      ? `${modifyChange.trim()} while preserving ${modifyKeep.trim()}`
      : modifyChange.trim();

    try {
      const response = await fetch(`${API_URL}/v1/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: IMAGE_MODEL,
          prompt: finalModifyPrompt,
          size: imageSize,
          extra_body: {
            image: [baseImageUrl],
            response_format: "url"
          }
        })
      });
      const data = await response.json();
      if (data.data && data.data[0] && data.data[0].url) {
        const newImageUrl = data.data[0].url;
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          url: newImageUrl,
          prompt: finalModifyPrompt,
          type: 'modify',
          timestamp: Date.now()
        };
        setGeneratedImage(newImageUrl);
        setHistoryImages(prev => [newItem, ...prev]);
        setBaseImageUrl(newImageUrl); // Set as default for next modification
      } else {
        throw new Error(data.error?.message || "Unknown API Error");
      }
    } catch (error) {
      console.error("Modification failed:", error);
      alert(`Modification Error: ${(error as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b-4 border-brand-dark pb-4">
        <div>
          <h1 className="font-syne font-extrabold text-4xl sm:text-5xl md:text-7xl tracking-tighter uppercase leading-none">
            AGNES<span className="text-brand-accent">_</span>OPS
          </h1>
          <p className="font-mono text-xs sm:text-sm mt-2 font-bold text-brand-muted uppercase tracking-widest">
            Visual Synthesis Unit // Streamlined
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 md:mt-0">
          <div className="text-[10px] sm:text-xs font-mono border border-brand-dark px-2 py-1 bg-brand-dark text-brand-light">
            SYS.STATUS: ONLINE
          </div>
          <div className="text-[10px] sm:text-xs font-mono border border-brand-dark px-2 py-1 bg-brand-accent text-brand-dark font-bold">
            V 2.0.0
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 flex-col lg:grid">
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8">
          
          {/* Navigation */}
          <nav className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {(['generate', 'modify'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-syne font-bold text-sm sm:text-lg md:text-2xl uppercase text-left py-2 px-3 md:py-3 md:px-4 border-2 transition-all flex items-center justify-between ${
                  activeTab === tab 
                    ? 'border-brand-accent bg-brand-accent text-brand-light translate-y-1 lg:translate-y-0 lg:translate-x-2' 
                    : 'border-transparent hover:border-brand-dark hover:translate-y-[2px] lg:hover:translate-y-0 lg:hover:translate-x-1'
                }`}
              >
                {tab === 'generate' && <span className="flex items-center gap-1 sm:gap-2"><ImageIcon className="w-4 h-4 sm:w-6 sm:h-6" /> 01. Generate</span>}
                {tab === 'modify' && <span className="flex items-center gap-1 sm:gap-2"><RefreshCw className="w-4 h-4 sm:w-6 sm:h-6" /> 02. Modify</span>}
                <ChevronRight className="hidden sm:block w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            ))}
          </nav>

          {/* Dynamic Input Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-brand-light border-brutal p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand-dark opacity-10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
              
              {activeTab === 'generate' && (
                <>
                  <h2 className="font-syne font-bold text-xl sm:text-2xl uppercase border-b-2 border-brand-dark pb-2">Generation Setup</h2>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-muted">Image Prompt</label>
                    <textarea 
                      className="input-brutal w-full h-32 sm:h-40 p-3 font-mono text-xs sm:text-sm bg-transparent resize-none"
                      placeholder="Describe your image concept here..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-muted">Output Size</label>
                    <select 
                      className="input-brutal w-full p-2 sm:p-3 font-mono text-xs sm:text-sm bg-transparent cursor-pointer"
                      value={imageSize}
                      onChange={(e) => setImageSize(e.target.value)}
                    >
                      <option value="1024x1024">1024x1024 (Square 1:1)</option>
                      <option value="1024x768">1024x768 (Landscape 4:3)</option>
                      <option value="768x1024">768x1024 (Portrait 3:4)</option>
                      <option value="1280x720">1280x720 (Wide 16:9)</option>
                      <option value="720x1280">720x1280 (Vertical 9:16)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-3 mt-2">
                    <button 
                      onClick={handleOptimize}
                      disabled={!prompt || isOptimizing || isGenerating}
                      className="w-full border-2 border-brand-dark bg-transparent text-brand-dark hover:bg-brand-dark hover:text-brand-light transition-colors font-syne font-bold text-sm sm:text-base uppercase py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isOptimizing ? <RefreshCw className="animate-spin" size={16} /> : <Wand2 size={16} />}
                      {isOptimizing ? 'Optimizing...' : 'Auto-Optimize Prompt (Optional)'}
                    </button>
                    
                    <button 
                      onClick={handleGenerate}
                      disabled={!prompt || isGenerating || isOptimizing}
                      className="group relative w-full border-2 border-brand-dark bg-brand-dark text-brand-light font-syne font-bold text-sm sm:text-base uppercase py-3 sm:py-4 overflow-hidden disabled:opacity-50"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                        {isGenerating ? 'Synthesizing...' : 'Generate Image'}
                      </span>
                      <div className="absolute inset-0 bg-brand-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'modify' && (
                <>
                  <h2 className="font-syne font-bold text-xl sm:text-2xl uppercase border-b-2 border-brand-dark pb-2">Image Modification</h2>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-muted">Base Image URL</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                      <input 
                        type="url"
                        className="input-brutal w-full p-2 sm:p-3 pl-9 font-mono text-xs sm:text-sm bg-transparent"
                        placeholder="https://example.com/image.jpg"
                        value={baseImageUrl}
                        onChange={(e) => setBaseImageUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-accent">1. What to change?</label>
                      <textarea 
                        className="input-brutal w-full h-20 sm:h-24 p-3 font-mono text-xs sm:text-sm bg-transparent resize-none"
                        placeholder="E.g., Transform the scene into a rain-soaked cyberpunk night with neon reflections..."
                        value={modifyChange}
                        onChange={(e) => setModifyChange(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-muted">2. What to keep? (Optional)</label>
                      <input 
                        type="text"
                        className="input-brutal w-full p-2 sm:p-3 font-mono text-xs sm:text-sm bg-transparent"
                        placeholder="E.g., the original composition and main subject layout"
                        value={modifyKeep}
                        onChange={(e) => setModifyKeep(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-muted">3. Output Size</label>
                      <select 
                        className="input-brutal w-full p-2 sm:p-3 font-mono text-xs sm:text-sm bg-transparent cursor-pointer"
                        value={imageSize}
                        onChange={(e) => setImageSize(e.target.value)}
                      >
                        <option value="1024x1024">1024x1024 (Square 1:1)</option>
                        <option value="1024x768">1024x768 (Landscape 4:3)</option>
                        <option value="768x1024">768x1024 (Portrait 3:4)</option>
                        <option value="1280x720">1280x720 (Wide 16:9)</option>
                        <option value="720x1280">720x1280 (Vertical 9:16)</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={handleModify}
                    disabled={!baseImageUrl || !modifyChange || isGenerating}
                    className="group relative w-full border-2 border-brand-dark bg-brand-dark text-brand-light font-syne font-bold text-sm sm:text-base uppercase py-3 sm:py-4 overflow-hidden mt-2 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />} 
                      {isGenerating ? 'Synthesizing...' : 'Execute Modification'}
                    </span>
                    <div className="absolute inset-0 bg-brand-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Output */}
        <div className="lg:col-span-7 flex flex-col h-full">
          {/* Visual Output */}
          <div className="border-brutal bg-brand-dark p-2 relative flex-1 min-h-[400px] md:min-h-[500px] flex items-center justify-center">
             <div className="absolute top-0 left-0 bg-brand-accent text-brand-light font-mono text-[10px] sm:text-xs px-2 py-1 uppercase tracking-widest font-bold -translate-y-1/2 translate-x-4 z-10">
              Output // Visual Canvas
            </div>
            
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-brand-light">
                <RefreshCw className="animate-spin text-brand-accent" size={40} />
                <span className="font-mono text-xs sm:text-sm uppercase tracking-widest animate-pulse text-center px-4">Synthesizing Visual Data...</span>
              </div>
            ) : generatedImage ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full flex flex-col items-center justify-center gap-4 p-2 sm:p-4 md:p-8 mt-4"
              >
                <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                  <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain border-2 border-brand-dark" />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 w-full flex-wrap">
                  <button 
                    onClick={() => {
                      const currentItem = historyImages.find(item => item.url === generatedImage);
                      if (currentItem) {
                        setFullscreenItem(currentItem);
                      } else {
                        // Fallback if not found in history for some reason
                        setFullscreenItem({
                          id: 'current',
                          url: generatedImage!,
                          prompt: prompt || modifyChange,
                          type: activeTab,
                          timestamp: Date.now()
                        });
                      }
                    }}
                    className="w-full sm:w-auto font-syne font-bold text-sm sm:text-base uppercase bg-brand-light text-brand-dark px-4 py-3 md:px-6 md:py-3 border-2 border-brand-dark hover:border-brand-accent transition-colors flex items-center justify-center gap-2"
                  >
                    <Maximize2 size={18} /> View Details
                  </button>
                  <button 
                    onClick={() => generatedImage && handleDownload(generatedImage)}
                    className="w-full sm:w-auto font-syne font-bold text-sm sm:text-base uppercase bg-brand-light text-brand-dark px-4 py-3 md:px-6 md:py-3 border-2 border-brand-dark hover:border-brand-accent transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={18} /> Download
                  </button>
                  <button 
                    onClick={() => {
                      setBaseImageUrl(generatedImage);
                      setActiveTab('modify');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto font-syne font-bold text-sm sm:text-base uppercase bg-brand-accent text-brand-light px-4 py-3 md:px-6 md:py-3 border-2 border-brand-dark hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} /> Modify This
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-brand-muted/30 flex items-center justify-center m-2 sm:m-4">
                <span className="font-mono text-xs sm:text-sm text-brand-muted uppercase tracking-widest text-center px-4">No visual data generated</span>
              </div>
            )}
          </div>
          
          {/* History Gallery */}
          {historyImages.length > 0 && (
            <div className="mt-4 border-brutal bg-brand-light p-4 overflow-x-auto">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-brand-dark" />
                <h3 className="font-syne font-bold text-sm uppercase tracking-wider text-brand-dark">Session History</h3>
              </div>
              <div className="flex gap-4">
                {historyImages.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 border-2 cursor-pointer group transition-all hover:scale-105 ${
                      baseImageUrl === item.url ? 'border-brand-accent' : 'border-brand-dark'
                    }`}
                    onClick={() => {
                      setFullscreenItem(item);
                    }}
                  >
                    <img src={item.url} alt={`History ${index}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/0 transition-colors"></div>
                    
                    {baseImageUrl === item.url && (
                      <div className="absolute top-0 right-0 bg-brand-accent text-brand-light font-mono text-[8px] sm:text-[10px] px-1 font-bold z-10">
                        ACTIVE
                      </div>
                    )}
                    <div className="absolute top-0 left-0 bg-brand-dark text-brand-light font-mono text-[8px] sm:text-[10px] px-1 font-bold z-10 uppercase">
                      {item.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FULLSCREEN MODAL / DETAILS VIEW */}
      <AnimatePresence>
        {fullscreenItem && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }} 
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col md:flex-row items-center justify-center md:justify-center bg-brand-dark/95 p-0 md:p-12 overflow-y-auto md:overflow-hidden gap-0 md:gap-8"
            onClick={() => setFullscreenItem(null)}
          >
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="fixed md:absolute top-4 right-4 md:top-8 md:right-8 text-brand-light hover:text-brand-accent transition-colors bg-brand-dark/80 backdrop-blur-sm border-2 border-brand-light hover:border-brand-accent p-2 rounded-none z-[60]"
              onClick={(e) => { e.stopPropagation(); setFullscreenItem(null); }}
            >
              <X size={24} className="md:w-8 md:h-8" />
            </motion.button>
            
            {/* Modal Image - Scrollable container on mobile */}
            <div className="w-full flex flex-col md:flex-row items-center md:justify-center min-h-min md:h-full py-16 md:py-0 px-4 md:px-0" onClick={(e) => e.stopPropagation()}>
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full md:flex-1 flex items-center justify-center md:h-full cursor-default mb-6 md:mb-0"
              >
                <img 
                  src={fullscreenItem.url} 
                  alt="Fullscreen" 
                  className="max-w-full max-h-[60vh] md:max-h-full object-contain border-4 border-brand-light shadow-2xl" 
                />
              </motion.div>

              {/* Modal Details Panel */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full md:w-96 bg-brand-light border-brutal p-6 flex flex-col gap-6 cursor-default flex-shrink-0"
              >
                <div>
                  <h3 className="font-syne font-bold text-xl sm:text-2xl uppercase border-b-2 border-brand-dark pb-2 mb-4">Generation Details</h3>
                  <div className="flex gap-2 mb-4">
                    <span className="bg-brand-dark text-brand-light font-mono text-[10px] px-2 py-1 font-bold uppercase">{fullscreenItem.type}</span>
                    <span className="border border-brand-dark text-brand-dark font-mono text-[10px] px-2 py-1 font-bold">
                      {new Date(fullscreenItem.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <label className="font-mono text-xs font-bold uppercase tracking-wider text-brand-muted">Prompt Context</label>
                  <div className="mt-1 p-3 bg-white border-2 border-brand-dark max-h-32 sm:max-h-48 overflow-y-auto">
                    <p className="font-mono text-xs sm:text-sm leading-relaxed">{fullscreenItem.prompt}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                  <button 
                    onClick={() => handleDownload(fullscreenItem.url)}
                    className="w-full font-syne font-bold text-sm sm:text-base uppercase bg-brand-light text-brand-dark px-4 py-3 border-2 border-brand-dark hover:border-brand-accent transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={18} /> Download Image
                  </button>
                  <button 
                    onClick={() => {
                      setGeneratedImage(fullscreenItem.url);
                      setBaseImageUrl(fullscreenItem.url);
                      setActiveTab('modify');
                      setFullscreenItem(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full font-syne font-bold text-sm sm:text-base uppercase bg-brand-accent text-brand-light px-4 py-3 border-2 border-brand-dark hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} /> Modify This
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
