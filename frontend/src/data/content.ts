import {
  Anchor,
  Banknote,
  ClipboardCheck,
  Cpu,
  Eye,
  HeartHandshake,
  Route,
  Scale,
  ShieldCheck,
  Warehouse,
  Zap,
} from 'lucide-react';

export const services = [
  {
    icon: ClipboardCheck,
    title: 'Митне оформлення',
    description:
      'Наші фахівці самостійно готують і подають митну декларацію, визначають код УКТ ЗЕД та супроводжують вантаж до випуску.',
    primary: true,
  },
  {
    icon: Route,
    title: 'Координація перевезення',
    description:
      'Як посередник організовуємо взаємодію між експедиторами та лінійними агентами на шляху вантажу.',
  },
  {
    icon: Anchor,
    title: 'Гданськ і Констанца',
    description:
      'Координуємо прибуття, обробку й видачу вантажу напряму з портами Польщі та Румунії.',
  },
  {
    icon: Warehouse,
    title: 'Від порту до складу',
    description: 'Організовуємо доставку вантажу до внутрішньої митниці й на склад клієнта.',
  },
];

export const steps = [
  {
    title: 'Консультація та попередня оцінка',
    description:
      'Уточнюємо маршрут і характеристики вантажу, пояснюємо порядок оформлення та готуємо індивідуальну комерційну пропозицію.',
  },
  {
    title: 'Координація переміщення вантажу',
    description:
      'Як посередник узгоджуємо роботу експедитора, лінійного агента й портових служб від порту відправлення до прибуття вантажу до митниці.',
  },
  {
    title: 'Митне оформлення',
    description:
      'Наші фахівці подають декларацію та проводять митне оформлення самостійно. Повідомляємо статус і наступні дії на кожному етапі.',
  },
  {
    title: 'Оплата після митного випуску',
    description: 'Послуги оплачуються після завершення оформлення. Ніяких передоплат!',
  },
  {
    title: 'Доставляємо до складу клієнта',
    description:
      'Після митного оформлення вантажу зв’язуємося з клієнтом для погодження місця вивантаження в Україні.',
  },
];

export const faqs = [
  {
    question: 'Яка роль ClearGateCustoms у перевезенні?',
    answer:
      'Митне оформлення вантажу ClearGateCustoms виконує самостійно — наші фахівці готують декларацію, визначають код УКТ ЗЕД і супроводжують випуск. Додатково ми виступаємо посередником і координатором супутньої логістики: узгоджуємо роботу експедиторів, лінійних агентів, портових служб і перевізника, щоб вантаж дістався вашого складу без затримок.',
  },
  {
    question: 'З якими портами ви працюєте?',
    answer:
      'Ми напряму працюємо з портами Гданська в Польщі та Констанци в Румунії. Конкретний порт і маршрут погоджуємо відповідно до поставки.',
  },
  {
    question: 'На яких напрямках ви спеціалізуєтеся?',
    answer:
      'Основна спеціалізація ClearGateCustoms — митне оформлення вантажів, яке виконують власні фахівці компанії. Спеціалізуємось на поставках з Китаю та країн Європи, з подальшою координацією доставки до складу клієнта в Україні.',
  },
  {
    question: 'Скільки триває оформлення?',
    answer:
      'Митне оформлення здійснюється протягом одного робочого дня з моменту прибуття вантажу на митний термінал.',
  },
  {
    question: 'Чи потрібна передоплата за послуги ClearGateCustoms?',
    answer:
      'Ні, передоплата за наші послуги не потрібна. Розрахунок проводиться після митного випуску вантажу, а клієнт отримує митну декларацію для звітності. Митні платежі сплачуються окремо відповідно до вимог оформлення.',
  },
  {
    question: 'Чи доставляєте ви вантаж по всій Україні?',
    answer:
      'Так, після митного випуску організовуємо перевезення до складу або клієнта в потрібному регіоні. Маршрут і тип транспорту підбираємо під конкретний вантаж.',
  },
  {
    question: 'Які документи потрібні для початку оформлення?',
    answer:
      'Зазвичай потрібні інвойс, пакувальний лист, транспортні документи, контракт і опис товару. Точний перелік брокер сформує після перевірки поставки.',
  },
];

export const testimonials = [
  {
    avatar: '/images/testimonials/olena.webp',
    quote:
      'Ще до прибуття контейнера ми знали план дій, строки й повну послідовність оформлення. ClearGateCustoms координували всіх учасників, а ми отримували статуси без нагадувань.',
    author: 'Олена К.',
    role: 'Імпортерка',
    sector: 'Побутова техніка',
    outcomes: ['План до прибуття', 'Статуси без нагадувань'],
  },
  {
    avatar: '/images/testimonials/andrii.webp',
    quote:
      'Команда швидко перебудувала маршрут через європейський порт і взяла на себе комунікацію з агентами. Вантаж приїхав на склад без простоїв між етапами.',
    author: 'Андрій М.',
    role: 'Керівник відділу закупівель',
    sector: 'Імпортні закупівлі',
    outcomes: ['Маршрут через ЄС', 'Без простоїв між етапами'],
  },
  {
    avatar: '/images/testimonials/iryna.webp',
    quote:
      'Для регулярних поставок нам налаштували зрозумілий процес: один менеджер, одна форма документів і чіткий план на кожну наступну партію.',
    author: 'Ірина С.',
    role: 'Операційна директорка',
    sector: 'FMCG',
    outcomes: ['Регулярні поставки', 'Один менеджер'],
  },
  {
    avatar: '/images/testimonials/dmytro.webp',
    quote:
      'Найцінніше — ClearGateCustoms одразу говорять, де є ризик і що потрібно виправити. Рішення приймаємо до прибуття вантажу, а не коли контейнер уже стоїть у порту.',
    author: 'Дмитро Л.',
    role: 'Власник компанії',
    sector: 'Дистрибуція',
    outcomes: ['Ризики заздалегідь', 'Рішення до прибуття'],
  },
];

export const productCategories = [
  {
    label: 'Побутова техніка',
    image: '/images/categories/home-appliances.webp',
  },
  {
    label: 'Мобільні аксесуари',
    image: '/images/categories/mobile-phones.webp',
  },
  {
    label: 'Постільна білизна, рушники та ковдри',
    image: '/images/categories/bedding-home-textiles.webp',
  },
  {
    label: 'Риболовля',
    image: '/images/categories/fishing.webp',
  },
  {
    label: 'Музичні колонки',
    image: '/images/categories/household-electronics.webp',
  },
  {
    label: 'Радіотовари та радіоелектроніка',
    image: '/images/categories/radio-electronics.webp',
  },
  {
    label: 'Електрообладнання',
    image: '/images/categories/electrical-equipment.webp',
  },
  {
    label: 'Канцелярські товари',
    image: '/images/categories/stationery.webp',
  },
  {
    label: 'Іграшки',
    image: '/images/categories/toys-children.webp',
  },
  {
    label: 'Сумки, рюкзаки та валізи',
    image: '/images/categories/bags-luggage.webp',
  },
  {
    label: 'Товари для дому',
    image: '/images/categories/home-goods.webp',
  },
  {
    label: 'Кухонне начиння',
    image: '/images/categories/kitchen-utensils.webp',
  },
  {
    label: 'Посуд',
    image: '/images/categories/tableware.webp',
  },
  {
    label: 'Освітлювальне обладнання та ліхтарики',
    image: '/images/categories/lighting-flashlights.webp',
  },
  {
    label: 'Меблі',
    image: '/images/categories/furniture-home.webp',
  },
  {
    label: 'Сантехніка',
    image: '/images/categories/plumbing.webp',
  },
  {
    label: 'Інше',
    image: '/images/categories/other-goods.webp',
  },
];

export const currencies = [
  { code: 'USD', label: 'USD', rate: null },
  { code: 'EUR', label: 'EUR', rate: null },
  { code: 'UAH', label: 'UAH', rate: 1 },
];

// Замініть ім'я та посилання на актуальні контакти менеджера перед публікацією сайту.
export const directContact = {
  personName: 'Менеджер ClearGateCustoms',
  position: 'Консультації з митного оформлення',
  initials: 'CG',
  phone: '+380 93 830 7006',
  phoneHref: 'tel:+380938307006',
  channels: [
    {
      name: 'Viber',
      label: 'Написати у Viber',
      href: 'viber://chat?number=%2B380938307006',
      icon: '/images/messengers/viber.svg',
    },
    {
      name: 'Telegram',
      label: 'Написати у Telegram',
      href: 'tg://resolve?phone=380938307006',
      icon: '/images/messengers/telegram.svg',
    },
    {
      name: 'WhatsApp',
      label: 'Написати у WhatsApp',
      href: 'https://wa.me/380938307006',
      icon: '/images/messengers/whatsapp.svg',
    },
  ],
};

export const trustIcon = ShieldCheck;

export const mission =
  'Ми відкриваємо бізнесу шлях до митного оформлення без зайвих перешкод, роблячи його простим, прозорим і передбачуваним.';

export const values = [
  { icon: Scale, label: 'Законність' },
  { icon: ShieldCheck, label: 'Надійність' },
  { icon: Eye, label: 'Прозорість' },
  { icon: Cpu, label: 'Технології' },
  { icon: ClipboardCheck, label: 'Відповідальність' },
  { icon: Zap, label: 'Швидкість' },
  { icon: HeartHandshake, label: 'Повага до кожного клієнта' },
  { icon: Banknote, label: 'Без передоплат' },
];

export const partners = [
  { name: 'Maersk', logo: '/images/partners/maersk-logo.svg' },
  { name: 'CMA CGM', logo: '/images/partners/cma-cgm-logo.svg' },
  { name: 'Evergreen', logo: '/images/partners/evergreen-logo.svg' },
  { name: 'COSCO', logo: '/images/partners/cosco-logo.svg' },
  { name: 'OOCL', logo: '/images/partners/oocl-logo.svg' },
  { name: 'MSC', logo: '/images/partners/msc-logo.svg' },
  { name: 'ZIM', logo: '/images/partners/zim-logo.svg' },
];
