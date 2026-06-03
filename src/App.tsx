import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Image as ImageIcon, Zap, RefreshCw, ChevronRight, X, Maximize2, Link as LinkIcon } from 'lucide-react';

type Tab = 'generate' | 'modify';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [prompt, setPrompt] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [baseImageUrl, setBaseImageUrl] = useState('');
  const [modifyInstructions, setModifyInstructions] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;
  const TEXT_MODEL = import.meta.env.VITE_TEXT_MODEL;
  const IMAGE_MODEL = import.meta.env.VITE_IMAGE_MODEL;

  const handleOptimize = async () => {
    if (!prompt) return;
    setIsOptimizing(true);
    try {
      const response = await fetch(`${API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
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
      const response = await fetch(`${API_URL}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: IMAGE_MODEL,
          prompt: prompt,
          n: 1,
          size: "1024x1024"
        })
      });
      const data = await response.json();
      if (data.data && data.data[0] && data.data[0].url) {
        setGeneratedImage(data.data[0].url);
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
    if (!baseImageUrl || !modifyInstructions) return;
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_URL}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: IMAGE_MODEL,
          prompt: modifyInstructions,
          tags: ["img2img"],
          size: "1024x1024",
          extra_body: {
            image: [baseImageUrl],
            response_format: "url"
          }
        })
      });
      const data = await response.json();
      if (data.data && data.data[0] && data.data[0].url) {
        setGeneratedImage(data.data[0].url);
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
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-brand-dark pb-4">
        <div>
          <h1 className="font-syne font-extrabold text-5xl md:text-7xl tracking-tighter uppercase leading-none">
            AGNES<span className="text-brand-accent">_</span>OPS
          </h1>
          <p className="font-mono text-sm mt-2 font-bold text-brand-muted uppercase tracking-widest">
            Visual Synthesis Unit // Streamlined
          </p>
        </div>
        <div className="flex gap-4 mt-6 md:mt-0">
          <div className="text-xs font-mono border border-brand-dark px-2 py-1 bg-brand-dark text-brand-light">
            SYS.STATUS: ONLINE
          </div>
          <div className="text-xs font-mono border border-brand-dark px-2 py-1 bg-brand-accent text-brand-dark font-bold">
            V 2.0.0
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {(['generate', 'modify'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-syne font-bold text-2xl uppercase text-left py-3 px-4 border-2 transition-all flex items-center justify-between ${
                  activeTab === tab 
                    ? 'border-brand-accent bg-brand-accent text-brand-light translate-x-2' 
                    : 'border-transparent hover:border-brand-dark hover:translate-x-1'
                }`}
              >
                {tab === 'generate' && <span className="flex items-center gap-2"><ImageIcon size={24} /> 01. Generate Image</span>}
                {tab === 'modify' && <span className="flex items-center gap-2"><RefreshCw size={24} /> 02. Modify Image</span>}
                {activeTab === tab && <ChevronRight size={24} />}
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
              className="bg-brand-light border-brutal p-6 flex flex-col gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand-dark opacity-10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
              
              {activeTab === 'generate' && (
                <>
                  <h2 className="font-syne font-bold text-2xl uppercase border-b-2 border-brand-dark pb-2">Generation Setup</h2>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-brand-muted">Image Prompt</label>
                    <textarea 
                      className="w-full h-40 p-3 font-mono text-sm border-2 border-brand-dark bg-transparent focus:outline-none focus:border-brand-accent resize-none"
                      placeholder="Describe your image concept here..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-3 mt-2">
                    <button 
                      onClick={handleOptimize}
                      disabled={!prompt || isOptimizing || isGenerating}
                      className="w-full border-2 border-brand-dark bg-transparent text-brand-dark hover:bg-brand-dark hover:text-brand-light transition-colors font-syne font-bold uppercase py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isOptimizing ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
                      {isOptimizing ? 'Optimizing...' : 'Auto-Optimize Prompt (Optional)'}
                    </button>
                    
                    <button 
                      onClick={handleGenerate}
                      disabled={!prompt || isGenerating || isOptimizing}
                      className="group relative w-full border-2 border-brand-dark bg-brand-dark text-brand-light font-syne font-bold uppercase py-4 overflow-hidden disabled:opacity-50"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isGenerating ? <RefreshCw className="animate-spin" /> : <Zap />}
                        {isGenerating ? 'Synthesizing...' : 'Generate Image'}
                      </span>
                      <div className="absolute inset-0 bg-brand-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'modify' && (
                <>
                  <h2 className="font-syne font-bold text-2xl uppercase border-b-2 border-brand-dark pb-2">Image Modification</h2>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-brand-muted">Base Image URL</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                      <input 
                        type="url"
                        className="w-full p-3 pl-9 font-mono text-sm border-2 border-brand-dark bg-transparent focus:outline-none focus:border-brand-accent"
                        placeholder="https://example.com/image.jpg"
                        value={baseImageUrl}
                        onChange={(e) => setBaseImageUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-brand-muted">Modification Instructions</label>
                    <textarea 
                      className="w-full h-32 p-3 font-mono text-sm border-2 border-brand-dark bg-transparent focus:outline-none focus:border-brand-accent resize-none"
                      placeholder="E.g., 'Change the background to a cyberpunk city', 'Make it cinematic'"
                      value={modifyInstructions}
                      onChange={(e) => setModifyInstructions(e.target.value)}
                    />
                  </div>

                  <button 
                    onClick={handleModify}
                    disabled={!baseImageUrl || !modifyInstructions || isGenerating}
                    className="group relative w-full border-2 border-brand-dark bg-brand-dark text-brand-light font-syne font-bold uppercase py-4 overflow-hidden mt-2 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isGenerating ? <RefreshCw className="animate-spin" /> : <Wand2 />} 
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
          <div className="border-brutal bg-brand-dark p-2 relative flex-1 min-h-[500px] flex items-center justify-center">
             <div className="absolute top-0 left-0 bg-brand-accent text-brand-light font-mono text-xs px-2 py-1 uppercase tracking-widest font-bold -translate-y-1/2 translate-x-4 z-10">
              Output // Visual Canvas
            </div>
            
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-brand-light">
                <RefreshCw className="animate-spin text-brand-accent" size={48} />
                <span className="font-mono text-sm uppercase tracking-widest animate-pulse">Synthesizing Visual Data...</span>
              </div>
            ) : generatedImage ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 mt-4"
              >
                <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                  <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain border-2 border-brand-dark" />
                </div>
                <div className="flex items-center justify-center gap-4 w-full">
                  <button 
                    onClick={() => setIsFullscreen(true)}
                    className="font-syne font-bold uppercase bg-brand-light text-brand-dark px-6 py-3 border-2 border-brand-dark hover:border-brand-accent transition-colors flex items-center gap-2"
                  >
                    <Maximize2 size={18} /> View Full Size
                  </button>
                  <button 
                    onClick={() => {
                      setBaseImageUrl(generatedImage);
                      setActiveTab('modify');
                    }}
                    className="font-syne font-bold uppercase bg-brand-accent text-brand-light px-6 py-3 border-2 border-brand-dark hover:bg-brand-dark transition-colors"
                  >
                    Modify This
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-brand-muted/30 flex items-center justify-center m-4">
                <span className="font-mono text-sm text-brand-muted uppercase tracking-widest">No visual data generated</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FULLSCREEN MODAL */}
      <AnimatePresence>
        {isFullscreen && generatedImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 backdrop-blur-md p-4 md:p-12 cursor-zoom-out"
            onClick={() => setIsFullscreen(false)}
          >
            <button 
              className="absolute top-4 right-4 md:top-8 md:right-8 text-brand-muted hover:text-brand-accent transition-colors"
              onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
            >
              <X size={40} />
            </button>
            <img 
              src={generatedImage} 
              alt="Fullscreen" 
              className="max-w-full max-h-full object-contain border-4 border-brand-light shadow-2xl cursor-default" 
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
