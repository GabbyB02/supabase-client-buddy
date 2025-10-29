import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "El nombre es requerido" })
    .max(100, { message: "El nombre debe tener máximo 100 caracteres" }),
  email: z
    .string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "El email debe tener máximo 255 caracteres" }),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        // Validate phone number: allow +, digits, spaces, hyphens, parentheses
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(val) && val.replace(/\D/g, "").length >= 7;
      },
      { message: "Teléfono inválido (mínimo 7 dígitos)" }
    ),
});

export type ClientFormData = z.infer<typeof clientSchema>;
