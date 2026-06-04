import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github } from 'lucide-react';

import { FullscreenModal } from './components/FullscreenModal';
import { GeneratePanel } from './components/GeneratePanel';
import { Header } from './components/Header';
import { HistoryGallery } from './components/HistoryGallery';
import { ModifyPanel } from './components/ModifyPanel';
import { OutputPanel } from './components/OutputPanel';
import { TabNav } from './components/TabNav';
import { t } from './constants/i18n';
import { MAX_HISTORY_ITEMS } from './constants/options';
import { generateImage, generatePromptVariants, modifyImage, optimizePrompt } from './services/agnesApi';
import type { HistoryItem, Lang, PromptVariant, Tab } from './types';
import { downloadImage } from './utils/download';
import { readFileAsDataUrl } from './utils/files';
import { loadHistory, saveHistory } from './utils/storage';

function buildModifyPrompt(modifyChange: string, modifyKeep: string) {
  return modifyKeep.trim()
    ? `${modifyChange.trim()} while preserving ${modifyKeep.trim()}`
    : modifyChange.trim();
}

function createHistoryId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptVariants, setPromptVariants] = useState<PromptVariant[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState('1024x1024');
  const [baseImageUrl, setBaseImageUrl] = useState('');
  const [baseImageName, setBaseImageName] = useState('');
  const [isUploadingBaseImage, setIsUploadingBaseImage] = useState(false);
  const [historyImages, setHistoryImages] = useState<HistoryItem[]>(() => loadHistory());
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [modifyChange, setModifyChange] = useState('');
  const [modifyKeep, setModifyKeep] = useState('the original composition and main subject layout');
  const [modifyNegativePrompt, setModifyNegativePrompt] = useState('');
  const [fullscreenItem, setFullscreenItem] = useState<HistoryItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const text = useMemo(() => t[lang], [lang]);

  useEffect(() => {
    if (historyImages.length > 0) {
      setGeneratedImage((current) => current ?? historyImages[0].url);
      setBaseImageUrl((current) => current || historyImages[0].url);
    }
  }, [historyImages]);

  useEffect(() => {
    if (historyImages.length === 0) {
      setSelectedHistoryId(null);
      return;
    }

    setSelectedHistoryId((current) => {
      if (current && historyImages.some((item) => item.id === current)) {
        return current;
      }

      return historyImages[0].id;
    });
  }, [historyImages]);

  useEffect(() => {
    if (fullscreenItem) {
      setShowDetails(false);
    }
  }, [fullscreenItem]);

  useEffect(() => {
    saveHistory(historyImages);
  }, [historyImages]);

  const handleDownload = async (url: string) => {
    await downloadImage(url);
  };

  const handleOptimize = async () => {
    if (!prompt) {
      return;
    }

    setIsOptimizing(true);
    try {
      const optimizedPrompt = await optimizePrompt(prompt, lang);
      setPrompt(optimizedPrompt);
    } catch (error) {
      console.error('Optimization failed:', error);
      alert(`${text.opt_err}: ${(error as Error).message}`);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerateVariants = async () => {
    if (!prompt) {
      return;
    }

    setIsGeneratingVariants(true);
    try {
      const variants = await generatePromptVariants(prompt, lang);
      setPromptVariants(variants);
    } catch (error) {
      console.error('Variant generation failed:', error);
      alert(`${text.variants_err}: ${(error as Error).message}`);
    } finally {
      setIsGeneratingVariants(false);
    }
  };

  const appendHistoryItem = (item: HistoryItem) => {
    setHistoryImages((previous) => [item, ...previous].slice(0, MAX_HISTORY_ITEMS));
    setGeneratedImage(item.url);
    setBaseImageUrl(item.url);
    setBaseImageName('');
    setSelectedHistoryId(item.id);
  };

  const getHistoryLabel = (item: HistoryItem) => {
    const typeLabel =
      item.type === 'generate'
        ? text.tab_generate.replace('01. ', '')
        : text.tab_modify.replace('02. ', '');

    return `${typeLabel} ${new Date(item.timestamp).toLocaleTimeString()}`;
  };

  const handleGenerate = async () => {
    if (!prompt) {
      return;
    }

    setIsGenerating(true);
    try {
      const imageUrl = await generateImage({
        prompt,
        size: imageSize,
        negativePrompt: negativePrompt.trim()
      });

      appendHistoryItem({
        id: createHistoryId(),
        url: imageUrl,
        prompt,
        negativePrompt: negativePrompt.trim(),
        type: 'generate',
        timestamp: Date.now(),
        size: imageSize
      });
      setPromptVariants([]);
    } catch (error) {
      console.error('Generation failed:', error);
      alert(`${text.gen_err}: ${(error as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModify = async () => {
    if (!baseImageUrl || !modifyChange) {
      return;
    }

    setIsGenerating(true);

    const finalModifyPrompt = buildModifyPrompt(modifyChange, modifyKeep);
    const sourceHistoryItem = historyImages.find((item) => item.url === baseImageUrl);

    try {
      const imageUrl = await modifyImage({
        baseImageUrl,
        prompt: finalModifyPrompt,
        size: imageSize,
        negativePrompt: modifyNegativePrompt.trim()
      });

      appendHistoryItem({
        id: createHistoryId(),
        url: imageUrl,
        prompt: finalModifyPrompt,
        negativePrompt: modifyNegativePrompt.trim(),
        type: 'modify',
        timestamp: Date.now(),
        size: imageSize,
        baseImageUrl,
        changeInstructions: modifyChange.trim(),
        keepInstructions: modifyKeep.trim(),
        sourceHistoryId: sourceHistoryItem?.id,
        sourceHistoryPrompt: sourceHistoryItem?.prompt,
        sourceLabel: sourceHistoryItem ? getHistoryLabel(sourceHistoryItem) : undefined,
        localBaseImageName: baseImageName || undefined
      });
    } catch (error) {
      console.error('Modification failed:', error);
      alert(`${text.mod_err}: ${(error as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenCurrentItem = () => {
    if (!generatedImage) {
      return;
    }

    const currentItem = historyImages.find((item) => item.url === generatedImage);

    if (currentItem) {
      setFullscreenItem(currentItem);
      return;
    }

    setFullscreenItem({
      id: 'current-preview',
      url: generatedImage,
      prompt: activeTab === 'generate' ? prompt : buildModifyPrompt(modifyChange, modifyKeep),
      negativePrompt: activeTab === 'generate' ? negativePrompt : modifyNegativePrompt,
      type: activeTab,
      timestamp: Date.now(),
      size: imageSize,
      baseImageUrl: activeTab === 'modify' ? baseImageUrl : undefined,
      changeInstructions: activeTab === 'modify' ? modifyChange : undefined,
      keepInstructions: activeTab === 'modify' ? modifyKeep : undefined,
      localBaseImageName: activeTab === 'modify' ? baseImageName || undefined : undefined
    });
  };

  const handleBaseImageUpload = async (file: File) => {
    setIsUploadingBaseImage(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setBaseImageUrl(dataUrl);
      setBaseImageName(file.name);
      setActiveTab('modify');
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsUploadingBaseImage(false);
    }
  };

  const handleClearBaseImage = () => {
    setBaseImageUrl('');
    setBaseImageName('');
  };

  const handleRestoreHistoryItem = (item: HistoryItem) => {
    setGeneratedImage(item.url);
    setImageSize(item.size);

    if (item.type === 'generate') {
      setActiveTab('generate');
      setPrompt(item.prompt);
      setNegativePrompt(item.negativePrompt);
      setPromptVariants([]);
    } else {
      setActiveTab('modify');
      setBaseImageUrl(item.baseImageUrl || item.url);
      setBaseImageName(item.localBaseImageName || '');
      setModifyChange(item.changeInstructions || item.prompt);
      setModifyKeep(item.keepInstructions || '');
      setModifyNegativePrompt(item.negativePrompt);
    }

    setFullscreenItem(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    const removedItem = historyImages.find((item) => item.id === id);
    const nextHistory = historyImages.filter((item) => item.id !== id);

    setHistoryImages(nextHistory);

    if (fullscreenItem?.id === id) {
      setFullscreenItem(null);
    }

    if (!removedItem) {
      return;
    }

    if (generatedImage === removedItem.url) {
      setGeneratedImage(nextHistory[0]?.url ?? null);
    }

    if (baseImageUrl === removedItem.url) {
      setBaseImageUrl(nextHistory[0]?.url ?? '');
      setBaseImageName('');
    }

    if (selectedHistoryId === id) {
      setSelectedHistoryId(nextHistory[0]?.id ?? null);
    }
  };

  const handleClearHistory = () => {
    setHistoryImages([]);
    setGeneratedImage(null);
    setBaseImageUrl('');
    setBaseImageName('');
    setFullscreenItem(null);
  };

  const handleModifyThis = (url: string) => {
    setGeneratedImage(url);
    setBaseImageUrl(url);
    setBaseImageName('');
    setActiveTab('modify');
    setFullscreenItem(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-3 sm:p-4 md:p-8">
      <Header lang={lang} text={text} onToggleLang={() => setLang(lang === 'en' ? 'zh' : 'en')} />

      <main className="flex w-full max-w-7xl flex-col gap-6 md:gap-8 lg:grid lg:grid-cols-12">
        <div className="flex flex-col gap-6 md:gap-8 lg:col-span-5">
          <TabNav activeTab={activeTab} text={text} onTabChange={setActiveTab} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-col gap-4 overflow-hidden border-brutal bg-brand-light p-4 sm:gap-6 sm:p-6"
            >
              <div
                className="absolute right-0 top-0 h-16 w-16 bg-brand-dark opacity-10"
                style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
              />

              {activeTab === 'generate' ? (
                <GeneratePanel
                  text={text}
                  prompt={prompt}
                  negativePrompt={negativePrompt}
                  imageSize={imageSize}
                  isOptimizing={isOptimizing}
                  isGeneratingVariants={isGeneratingVariants}
                  isGenerating={isGenerating}
                  promptVariants={promptVariants}
                  onPromptChange={setPrompt}
                  onNegativePromptChange={setNegativePrompt}
                  onSizeChange={setImageSize}
                  onOptimize={handleOptimize}
                  onGenerateVariants={handleGenerateVariants}
                  onUseVariant={(variant) => setPrompt(variant.prompt)}
                  onGenerate={handleGenerate}
                />
              ) : (
                <ModifyPanel
                  lang={lang}
                  text={text}
                  baseImageUrl={baseImageUrl}
                  baseImageName={baseImageName}
                  modifyChange={modifyChange}
                  modifyKeep={modifyKeep}
                  modifyNegativePrompt={modifyNegativePrompt}
                  imageSize={imageSize}
                  isGenerating={isGenerating}
                  isUploadingBaseImage={isUploadingBaseImage}
                  onBaseImageUrlChange={(value) => {
                    setBaseImageUrl(value);
                    if (!value.startsWith('data:')) {
                      setBaseImageName('');
                    }
                  }}
                  onBaseImageUpload={(file) => {
                    void handleBaseImageUpload(file);
                  }}
                  onClearBaseImage={handleClearBaseImage}
                  onModifyChange={setModifyChange}
                  onModifyKeep={setModifyKeep}
                  onModifyNegativePrompt={setModifyNegativePrompt}
                  onSizeChange={setImageSize}
                  onApplyPreset={(preset) => setModifyChange(preset)}
                  onModify={handleModify}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex h-full flex-col lg:col-span-7">
          <OutputPanel
            text={text}
            isGenerating={isGenerating}
            generatedImage={generatedImage}
            onOpenDetails={handleOpenCurrentItem}
            onDownload={() => {
              if (generatedImage) {
                void handleDownload(generatedImage);
              }
            }}
            onModifyThis={() => {
              if (generatedImage) {
                handleModifyThis(generatedImage);
              }
            }}
          />

          <HistoryGallery
            text={text}
            historyImages={historyImages}
            baseImageUrl={baseImageUrl}
            selectedItemId={selectedHistoryId}
            onSelectItem={(item) => setSelectedHistoryId(item.id)}
            onOpenItem={setFullscreenItem}
            onDeleteItem={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
            onRestoreItem={handleRestoreHistoryItem}
            onUseAsBase={handleModifyThis}
          />
        </div>
      </main>

      <footer className="mt-8 flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t-4 border-brand-dark pt-6 sm:flex-row md:mt-12">
        <div className="font-mono text-xs font-bold uppercase tracking-widest text-brand-dark">
          Created by <span className="text-brand-accent">liuziting</span>
        </div>
        <a
          href="https://github.com/liu-ziting/agnes-images"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border-2 border-brand-dark px-4 py-2 font-syne text-sm font-bold uppercase transition-colors hover:bg-brand-dark hover:text-brand-light"
        >
          <Github size={16} /> View on GitHub
        </a>
      </footer>

      <FullscreenModal
        item={fullscreenItem}
        text={text}
        showDetails={showDetails}
        onClose={() => setFullscreenItem(null)}
        onToggleDetails={() => setShowDetails((current) => !current)}
        onDownload={(url) => {
          void handleDownload(url);
        }}
        onModifyThis={handleModifyThis}
        onRestoreItem={handleRestoreHistoryItem}
      />
    </div>
  );
}
