-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (internal team tool)
CREATE POLICY "Anyone can view clients"
ON public.clients
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create clients"
ON public.clients
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update clients"
ON public.clients
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete clients"
ON public.clients
FOR DELETE
USING (true);

-- Create index for email lookups
CREATE INDEX idx_clients_email ON public.clients(email);

-- Create index for status filtering
CREATE INDEX idx_clients_status ON public.clients(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();