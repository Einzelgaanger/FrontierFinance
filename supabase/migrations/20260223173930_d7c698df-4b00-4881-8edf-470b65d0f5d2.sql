
-- First Followers Capital: keep cd239009 (primary user 0f1faf91), delete a9dacad3 (secondary 6041bdf3)
DELETE FROM public.survey_responses_2021 WHERE id = 'a9dacad3-9cf3-4ca1-a33e-f5bf4731cf02';

-- MOST Ventures: keep c861db75 (primary user efc8bd1a), delete d3c18cdc (secondary 2e3ac02b)  
DELETE FROM public.survey_responses_2024 WHERE id = 'd3c18cdc-03f6-4aea-a0dc-1772803e0585';

-- SME Impact Fund 2024: reassign to primary user 2e3ac02b
UPDATE public.survey_responses_2024 SET user_id = '2e3ac02b-123d-486a-8eb9-3c2cd90a0a45' WHERE id = '7742f242-daec-4a62-a246-a5862f9e5518';
