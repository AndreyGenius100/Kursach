import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser, XMLSerializer } from "npm:@xmldom/xmldom@0.8.10";

/**
 * Заголовки CORS для обеспечения безопасности и 
 * возможности кросс-доменных запросов
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Разрешаем запросы с любого домена
  "Access-Control-Allow-Methods": "POST, OPTIONS", // Разрешенные методы
  "Access-Control-Allow-Headers": "Content-Type, Authorization", // Разрешенные заголовки
};

/**
 * Основной обработчик запросов
 * Сохраняет данные контактной формы в XML файл
 */
serve(async (req) => {
  // Обработка предварительных запросов OPTIONS (preflight requests)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Получение данных из тела запроса
    const data = await req.json();
    // Генерация временной метки для записи
    const timestamp = new Date().toISOString();
    
    // Создание XML документа с данными формы
    const doc = new DOMParser().parseFromString(
      `<?xml version="1.0" encoding="UTF-8"?>
      <contact>
        <timestamp>${timestamp}</timestamp>
        <name>${data.name}</name>
        <email>${data.email}</email>
        <phone>${data.phone}</phone>
        <message>${data.message}</message>
      </contact>`,
      'text/xml'
    );

    // Сериализация XML и сохранение во временный файл
    // Edge функции могут писать только в директорию /tmp
    const xmlString = new XMLSerializer().serializeToString(doc);
    await Deno.writeTextFile("/tmp/contact.xml", xmlString);

    // Отправка успешного ответа клиенту
    return new Response(
      JSON.stringify({ success: true, message: "Contact saved successfully" }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    // Обработка и отправка ошибок клиенту
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});