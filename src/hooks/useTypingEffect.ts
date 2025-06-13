export function useTypingEffect(text: string, speed: number) {
  const [displayText, setDisplayText] = useState('');
  const frameRef = useRef<number>();

  useEffect(() => {
    let start = performance.now();
    let index = 0;

    const animate = (timestamp: number) => {
      const progress = timestamp - start;
      const charCount = Math.floor(progress / speed);
      
      if (charCount > index) {
        index = Math.min(charCount, text.length);
        setDisplayText(text.slice(0, index));
      }

      if (index < text.length) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [text, speed]);

  return displayText;
}