const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjExYjcxMjNiODUxNjdkMDAxNmI3ZWQyMmYxNzQ0Zjk4ZTkzMjNmZmFiMDk3YzM4MThiMWJjMGY0M2M5OTNmYTUwNDlmMmFlYWU3YzdmZjUwIn0.eyJhdWQiOiJiYjE4MjNjZi0yNWUwLTQyZTEtYWZlOC0xMjNmNjJjYTAwMjUiLCJqdGkiOiIxMWI3MTIzYjg1MTY3ZDAwMTZiN2VkMjJmMTc0NGY5OGU5MzIzZmZhYjA5N2MzODE4YjFiYzBmNDNjOTkzZmE1MDQ5ZjJhZWFlN2M3ZmY1MCIsImlhdCI6MTcxODUyODk3MiwibmJmIjoxNzE4NTI4OTcyLCJleHAiOjE3Mzk0MDQ4MDAsInN1YiI6IjExMTYzNDUwIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxODAyNzM0LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiZjU1MWVhN2ItY2ExOS00ZDI2LTliZjctZGZiZTY3OTBiZDUxIn0.hll86cMhyK_KCRxkK-n6zvffiWpw3uYYZK-uCXMSPTZOZdi7R-eSi6_DKXiXPQxXaGTQO3kZ7lv4B3Rsu4L3XFS5q7UDUcosH-TTL7RTF_2SjWBCl5FDnLXhd-4pnPlYCnmmrI_riER9HbFCX1DZUyr_FK_SlaT6puTwWdET2DClrWjKCvKhbJ3beZ8BqTMBGOU-5bm0NUTXZYkSO4VEEImAup1g8jn44V8oqUD5GzNEWdpUjc36CriqxPZZ6FpyAzggUAzt-feaM_np-WYxN29GY0F19G3B27YJcx0p5nr7xQ7qKySonJjvXSuhtQUut9Xg7ki5tFIn0AW5bSMTfw'; // Замените на ваш access token
const baseURL = 'https://gooogerok.amocrm.ru/api/v4'; // Замените на ваш базовый URL amoCRM

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

async function getContactDetails(contactId) {
  try {
    const response = await axios.get(`${baseURL}/contacts/${contactId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const contact = response.data;

    // Извлекаем телефонный номер из полей контакта
    const phoneField = contact.custom_fields_values.find(field => field.field_code === 'PHONE');
    const phoneNumber = phoneField ? phoneField.values[0].value : 'Телефон не указан';

    return {
      name: contact.name,
      phone: phoneNumber,
    };
  } catch (error) {
    console.error(`Ошибка при получении контакта ${contactId}:`, error.message);
    return {
      name: 'Контакт не найден',
      phone: 'Телефон не указан',
    };
  }
}

async function getStatusName(statusId) {
  try {
    const response = await axios.get(`${baseURL}/leads/pipelines`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const pipelines = response.data._embedded.pipelines;

    for (const pipeline of pipelines) {
      const statuses = pipeline._embedded.statuses;
      const status = statuses.find(s => s.id === statusId);
      if (status) {
        return status.name;
      }
    }

    console.error(`Статус с ID ${statusId} не найден`);
    return 'Статус не определён';
  } catch (error) {
    if (error.response) {
      console.error(`Ошибка при получении статуса ${statusId}:`, error.response.status, error.response.data);
    } else if (error.request) {
      console.error(`Ошибка запроса при получении статуса ${statusId}:`, error.request);
    } else {
      console.error(`Произошла ошибка при выполнении запроса к API:`, error.message);
    }
    return 'Статус не определён';
  }
}

async function getResponsibleUserName(userId) {
  try {
    const response = await axios.get(`${baseURL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data && response.data.name) {
      return response.data.name;
    } else {
      console.error(`Пользователь с ID ${userId} не найден или у него отсутствует имя`);
      return 'Ответственный не определён';
    }
  } catch (error) {
    if (error.response) {
      console.error(`Ошибка при получении пользователя ${userId}:`, error.response.status, error.response.data);
    } else if (error.request) {
      console.error(`Ошибка запроса при получении пользователя ${userId}:`, error.request);
    } else {
      console.error(`Произошла ошибка при выполнении запроса к API:`, error.message);
    }
    return 'Ответственный не определён';
  }
}

app.get('/api/leads', async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/leads`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        with: 'contacts', // Включаем контакты в запрос
      },
    });

    const leadsWithDetails = await Promise.all(response.data._embedded.leads.map(async (lead) => {
      try {
        console.log('Обрабатывается сделка:', lead); // Логируем каждую сделку

        // Получаем название статуса
        lead.status = await getStatusName(lead.status_id);
        // Получаем имя и фамилию ответственного пользователя
        lead.responsible_user = await getResponsibleUserName(lead.responsible_user_id);

        // Обрабатываем контакты сделки
        const contacts = lead._embedded.contacts || [];
        if (contacts.length > 0) {
          console.log('Контакты сделки:', contacts); // Логируем контакты сделки
          const contactDetails = await Promise.all(
            contacts.map(contact => getContactDetails(contact.id))
          );
          lead.contacts = contactDetails;
        } else {
          lead.contacts = [];
        }

        return lead;
      } catch (error) {
        console.error('Ошибка при обработке сделки:', error.message);
        return { ...lead, error: 'Ошибка при обработке сделки' };
      }
    }));

    res.json({
      _page: response.data._page,
      _links: response.data._links,
      _embedded: {
        leads: leadsWithDetails,
      },
    });
  } catch (error) {
    console.error('Ошибка при получении сделок:', error.message);
    res.status(500).json({ error: 'Ошибка при получении сделок' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});