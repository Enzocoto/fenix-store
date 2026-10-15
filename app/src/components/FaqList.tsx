import type { Localized } from '../lib/lang';
import { useI18n } from '../hooks/useI18n';

export function FaqList({ items }: { items: { question: Localized; answer: Localized }[] }) {
  const { lang } = useI18n();
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.question.en}>
          <summary>
            <span>{item.question[lang]}</span>
          </summary>
          <p>{item.answer[lang]}</p>
        </details>
      ))}
    </div>
  );
}
