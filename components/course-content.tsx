"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import mermaid from "mermaid";

interface CourseContentProps {
  content: string;
}

// Composant pour les diagrammes Mermaid
function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [id] = useState(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
      });
      
      mermaid.render(id, chart)
        .then(({ svg }) => {
          setSvg(svg);
        })
        .catch((error) => {
          console.error("Mermaid rendering error:", error);
          setSvg(`<pre>${error.message}</pre>`);
        });
    }
  }, [chart, id]);

  return (
    <div 
      ref={ref} 
      className="my-6 overflow-auto rounded-md bg-white p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function CourseContent({ content }: CourseContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse h-96 bg-muted rounded-md" />;
  }

  // Fonction pour détecter si un texte contient des caractères arabes
  const containsArabic = (text: string) => {
    // Plage Unicode pour les caractères arabes
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/;
    return arabicPattern.test(text);
  };

  // Fonction pour transformer les liens audio en composants audio
  const processContent = (content: string) => {
    // Recherche des liens audio dans le format [audio:mot](url)
    const audioRegex = /\[audio:([^\]]+)\]\(([^)]+)\)/g;
    return content.replace(audioRegex, (match, word, url) => {
      return `<audio-player word="${word}" url="${url}"></audio-player>`;
    });
  };

  const processedContent = processContent(content);

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ className, ...props }) => (
            <h1 className={cn("text-3xl font-bold mt-8 mb-4", className)} {...props} />
          ),
          h2: ({ className, ...props }) => (
            <h2 className={cn("text-2xl font-bold mt-8 mb-4", className)} {...props} />
          ),
          h3: ({ className, ...props }) => (
            <h3 className={cn("text-xl font-bold mt-6 mb-3", className)} {...props} />
          ),
          p: ({ className, children, ...props }) => {
            // Vérifier si le paragraphe contient du texte arabe
            const hasArabic = typeof children === 'string' && containsArabic(children);
            return (
              <p className={cn("my-4", hasArabic && "arabic-text-lg", className)} {...props}>
                {children}
              </p>
            );
          },
          ul: ({ className, ...props }) => (
            <ul className={cn("my-4 list-disc pl-6", className)} {...props} />
          ),
          ol: ({ className, ...props }) => (
            <ol className={cn("my-4 list-decimal pl-6", className)} {...props} />
          ),
          li: ({ className, children, ...props }) => {
            // Vérifier si l'élément de liste contient du texte arabe
            const hasArabic = typeof children === 'string' && containsArabic(children);
            return (
              <li className={cn("my-1", hasArabic && "arabic-text", className)} {...props}>
                {children}
              </li>
            );
          },
          blockquote: ({ className, ...props }) => (
            <blockquote className={cn("border-l-4 border-primary pl-4 italic my-4", className)} {...props} />
          ),
          a: ({ className, href, children, ...props }) => {
            // Vérifier si c'est un lien audio
            if (href && href.match(/\.(mp3|wav|ogg)$/i)) {
              return (
                <AudioPlayer word={String(children)} url={href} />
              );
            }
            return (
              <a className={cn("text-primary underline", className)} href={href} {...props}>
                {children}
              </a>
            );
          },
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const inline = !match;
            
            // Vérifier si c'est un diagramme Mermaid
            if (match && match[1] === 'mermaid') {
              return <MermaidDiagram chart={String(children)} />;
            }
            
            // Vérifier si le code inline contient du texte arabe
            const hasArabic = inline && typeof children === 'string' && containsArabic(children);
            return !inline ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={cn("bg-muted px-1 py-0.5 rounded text-sm", hasArabic && "arabic-text", className)} {...props}>
                {children}
              </code>
            );
          },
          // Ajouter un traitement spécial pour les éléments strong qui contiennent du texte arabe
          strong: ({ className, children, ...props }) => {
            const hasArabic = typeof children === 'string' && containsArabic(children);
            return (
              <strong className={cn(hasArabic && "arabic-text-lg", className)} {...props}>
                {children}
              </strong>
            );
          },
        }}
        rehypePlugins={[
          // Custom plugin to handle audio-player tags
          () => (tree) => {
            const visit = (node: any) => {
              if (node.type === 'element' && node.tagName === 'audio-player') {
                const { word, url } = node.properties || {};
                node.children = [{
                  type: 'element',
                  tagName: 'span',
                  properties: {
                    className: 'inline-flex items-center gap-1'
                  },
                  children: [
                    {
                      type: 'element',
                      tagName: 'span',
                      properties: { className: 'font-bold' },
                      children: [{ type: 'text', value: word }]
                    },
                    {
                      type: 'element',
                      tagName: 'button',
                      properties: {
                        className: 'h-6 w-6 p-0 rounded-full inline-flex items-center justify-center text-primary',
                        'data-audio-url': url,
                        'data-audio-word': word,
                        onClick: 'playAudio(this)'
                      },
                      children: [
                        {
                          type: 'element',
                          tagName: 'span',
                          properties: { className: 'h-4 w-4' },
                          children: [{ type: 'text', value: '🔊' }]
                        }
                      ]
                    }
                  ]
                }];
              }
              if (node.children) {
                node.children.forEach(visit);
              }
            };
            visit(tree);
          }
        ]}
      >
        {processedContent}
      </ReactMarkdown>

      {/* Add script for audio playback */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function playAudio(button) {
              const url = button.getAttribute('data-audio-url');
              const word = button.getAttribute('data-audio-word');
              if (!url) return;
              
              const audio = new Audio(url);
              audio.play();
              
              button.classList.add('animate-pulse');
              audio.addEventListener('ended', () => {
                button.classList.remove('animate-pulse');
              });
            }
          `
        }}
      />
    </div>
  );
}

interface AudioPlayerProps {
  word: string;
  url: string;
}

function AudioPlayer({ word, url }: AudioPlayerProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Fonction pour détecter si un texte contient des caractères arabes
  const containsArabic = (text: string) => {
    // Plage Unicode pour les caractères arabes
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/;
    return arabicPattern.test(text);
  };
  
  // Vérifier si le mot est en arabe
  const isArabicWord = containsArabic(word);

  useEffect(() => {
    const audioElement = new Audio(url);
    setAudio(audioElement);

    audioElement.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    return () => {
      audioElement.pause();
      audioElement.removeEventListener('ended', () => {
        setIsPlaying(false);
      });
    };
  }, [url]);

  const togglePlay = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("font-bold", isArabicWord && "arabic-text")}>{word}</span>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 w-6 p-0 rounded-full" 
        onClick={togglePlay}
        title={`Écouter la prononciation de "${word}"`}
      >
        <Volume2 className={cn("h-4 w-4", isPlaying ? "text-primary animate-pulse" : "")} />
        <span className="sr-only">Écouter</span>
      </Button>
    </span>
  );
}