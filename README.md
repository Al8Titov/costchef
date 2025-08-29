- Пользователи (users): id / login / password / registered_at / role_id

- Роли (roles): id / name

- Блюда (dish): id / name / description (краткое описание) / image_url / process (технологический процесс) / weight / category_id (категория блюда) / cost_price (себестоимость) / created_at / updated_at

- Продукты (product): id / name / category_id (категория продукта на складе) / quantity (количество на складе) / unit (kg, l, шт) ztotal_price (сумма за всё количество) / price_per_unit (автоматический расчёт) / created_at / updated_at

- Связь блюд и продуктов (dish_product): id / dish_id / product_id / quantity (количество продукта в блюде) /unit

- Сессия текущего пользователя (BFF): login / password / role

Redux Store (клиент):

- user: id / login / roleId

- dishs: массив объектов { id / name / imageUrl / published / category_id / cost_price / weight }

- dish: объект (подробная информация по блюду)

- users: массив { id / login / registeredAt / role }


Запуск базы данных
json-server --watch src/db.json --port 3005
