
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzbRTgtBgG6mEURxF44CsSZ3cSas8JY_M5-26lZnkUcIeaLaAHjwq6REpoEFrbBZxc8/exec";

export const createMercadoPagoPreference = async (cart) => {
    const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({
            action: 'create_preference',
            items: cart
        }),
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
    });

    const data = await response.json();

    if (data.status === 'success' && data.init_point) {
        // Redirige al cliente a la pasarela oficial de Mercado Pago
        window.location.href = data.init_point;
    } else {
        throw new Error(data.message || "No se pudo generar el enlace de pago.");
    }
};