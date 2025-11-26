/**
 * Gera um código numérico aleatório de 6 dígitos para simular
 * o código de verificação enviado por e-mail.
 * @returns {string} Código de 6 dígitos.
 */
export const generateVerificationCode = () => {
    // Garante um número de 6 dígitos (entre 100000 e 999999)
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
};

// Constantes de tempo (em milissegundos)
export const NOTIFICATION_DURATION_MS = 7000; // 7 segundos para a notificação
export const RESEND_COOLDOWN_SECONDS = 5; // 5 segundos de espera para reenviar