import { useMemo, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

export type FAQItem = {
  id: string | number;
  question: string;
  answer: string;
};

export type FAQSectionProps = {
  title: string;
  faqItems: FAQItem[];
};

export default function FAQSection({ title, faqItems }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | number | null>(null);
  const left = useMemo(() => faqItems.filter((_, i) => i % 2 === 0), [faqItems]);
  const right = useMemo(() => faqItems.filter((_, i) => i % 2 === 1), [faqItems]);

  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }), [faqItems]);

  const renderCol = (items: FAQItem[]) => (
    <Box>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <Accordion
            key={item.id}
            disableGutters
            elevation={0}
            square
            expanded={isOpen}
            onChange={() => setOpenId(isOpen ? null : item.id)}
            sx={{ mb: 1, border: '1px solid', borderColor: 'divider' }}
          >
            <AccordionSummary expandIcon={isOpen ? <CloseIcon /> : <ExpandMoreIcon />}>
              <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );

  return (
    <Box>
      <Typography component="h2" variant="h5" align="center" sx={{ fontWeight: 700, mb: 2 }}>
        {title}
      </Typography>
      <Box component="script" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Box>
          {renderCol(left)}
        </Box>
        <Box>
          {renderCol(right)}
        </Box>
      </Box>
    </Box>
  );
}


