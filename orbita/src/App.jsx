// ================================================================
// 01) IMPORTS — استيراد الأدوات والمكتبات
// ================================================================
// useState: تخزين القيم التي تتغير أثناء استخدام التطبيق.
// useEffect: تنفيذ الحفظ المحلي وتحديث إعدادات الصفحة عند تغيّر القيم.
import { useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  BaseEdge,
  getBezierPath,
  Controls,
  MiniMap,
  addEdge,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import {
  LayoutDashboard,
  Lightbulb,
  Brain,
  BookOpen,
  FolderKanban,
  Settings,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Plus,
  Trash2,
  Pencil,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronDown,
  Orbit,
  FileText,
  Download,
  Upload,
  Layers,
  Maximize2,
} from "lucide-react";

// ================================================================
// 02) INITIAL DATA — الشكل الافتراضي لبيانات مدار
// ================================================================
// كل قسم يبدأ بقائمة فارغة عند أول تشغيل للتطبيق.
// بعد ذلك تُقرأ البيانات المحفوظة من LocalStorage.
const initialData = {
  ideas: [],
  maps: [],
  learning: [],
  projects: [],
};

// ================================================================
// 03) TRANSLATIONS — قاموس اللغتين العربية والإنجليزية
// ================================================================
// كل نص يظهر للمستخدم يجب أن يكون له مقابل هنا عند الحاجة.
// t في المكونات يختار النص المناسب حسب اللغة الحالية.
const words = {
  en: {
    dashboard: "Dashboard",
    ideas: "Ideas",
    maps: "Knowledge Maps",
    learning: "Learning",
    projects: "Projects",
    settings: "Settings",
    welcome: "Your space starts here.",
    subtitle:
      "Organize your thoughts, explore knowledge and track your growth.",
    ideasCount: "Ideas",
    mapsCount: "Knowledge Maps",
    learningCount: "Learning Topics",
    projectsCount: "Projects",
    recent: "Recent Activity",
    quick: "Quick Access",
    empty: "Nothing here yet.",
    start: "Start creating your personal space.",
    newIdea: "New Idea",
    viewAll: "View all",
    greeting: "Good to see you!",
    create: "Create",
    cancel: "Cancel",
    save: "Save",
    title: "Title",
    description: "Description",
    search: "Search...",
    addIdea: "Add Idea",
    ideaPlaceholder: "What's on your mind?",
    category: "Category",
    all: "All",
    noIdeas: "No ideas yet",
    addFirst: "Add your first idea.",
    newMap: "New Map",
    mapName: "Map name",
    newNode: "Add Node",
    fitMap: "Fit map",
    nodePlaceholder: "Node name",
    mapEmpty: "Create your first knowledge map.",
    addNodeTitle: "Add a new node",
    editNodeTitle: "Edit node",
    nodeDialogDescription: "Give this node a short, clear name.",
    nodeNamePlaceholder: "Enter node name...",
    updateNode: "Save changes",
    editNode: "Edit node",
    deleteNode: "Delete node",
    collapseBranch: "Collapse branch",
    expandBranch: "Expand branch",
    bulkNodes: "Add multiple branches",
    bulkTitle: "Add multiple branches",
    bulkDescription:
      "Enter one item per line, or separate items with commas. Each item becomes a child node connected to the selected parent.",
    bulkPlaceholder: "HTML\nCSS\nJavaScript\nReact",
    bulkCreate: "Create branches",
    bulkCount: "items to create",
    selectParentHint:
      "Click a node first to choose where the new branches will be added.",
    selectedParent: "Selected parent",
    mapInstructions:
      "Click a node to select it as a parent. Drag between handles to connect nodes. Double-click a node to edit it.",
    newTopic: "New Topic",
    topicName: "Topic name",
    lesson: "Add Lesson",
    lessonName: "Lesson title",
    noTopics: "No learning topics yet.",
    newProject: "New Project",
    task: "Add Task",
    taskPlaceholder: "Task name",
    todo: "To Do",
    doing: "In Progress",
    done: "Done",
    noProjects: "No projects yet.",
    active: "Active",
    completed: "Completed",
    delete: "Delete",
    edit: "Edit",
    clear: "Clear all data",
    confirm: "Are you sure?",
    appearance: "Appearance",
    language: "Language",
    light: "Light",
    dark: "Dark",
    english: "English",
    arabic: "Arabic",
    data: "Your Data",
    export: "Export Data",
    reset: "Reset Workspace",
    move: "Drag to move",
    back: "Back",
    noDescription: "No description",
    created: "Created",
    tasks: "Tasks",
    noTasks: "No tasks yet",
    progress: "Progress",
    welcomeBack: "Welcome to Orbita",
    add: "Add",
    saveChanges: "Save Changes",
  },
  ar: {
    dashboard: "الرئيسية",
    ideas: "أفكاري",
    maps: "خرائطي المعرفية",
    learning: "تعلمي",
    projects: "مشاريعي",
    settings: "الإعدادات",
    welcome: "مساحتك تبدأ من هنا.",
    subtitle: "نظّم أفكارك، اكتشف معرفتك، وتابع تقدمك.",
    ideasCount: "أفكارك",
    mapsCount: "خرائطك المعرفية",
    learningCount: "مواضيع التعلم",
    projectsCount: "مشاريعك",
    recent: "النشاط الأخير",
    quick: "وصول سريع",
    empty: "لا يوجد شيء هنا بعد.",
    start: "ابدأ ببناء مساحتك الخاصة.",
    newIdea: "فكرة جديدة",
    viewAll: "عرض الكل",
    greeting: "سعيدون بوجودك!",
    create: "إنشاء",
    cancel: "إلغاء",
    save: "حفظ",
    title: "العنوان",
    description: "الوصف",
    search: "بحث...",
    addIdea: "إضافة فكرة",
    ideaPlaceholder: "ماذا يدور في ذهنك؟",
    category: "التصنيف",
    all: "الكل",
    noIdeas: "لا توجد أفكار بعد",
    addFirst: "أضف فكرتك الأولى.",
    newMap: "خريطة جديدة",
    mapName: "اسم الخريطة",
    newNode: "إضافة عقدة",
    fitMap: "إظهار الخريطة كاملة",
    nodePlaceholder: "اسم العقدة",
    mapEmpty: "أنشئ خريطتك المعرفية الأولى.",
    addNodeTitle: "إضافة عقدة جديدة",
    editNodeTitle: "تعديل العقدة",
    nodeDialogDescription: "اكتب اسماً قصيراً وواضحاً لهذه العقدة.",
    nodeNamePlaceholder: "اكتب اسم العقدة...",
    updateNode: "حفظ التعديلات",
    editNode: "تعديل العقدة",
    deleteNode: "حذف العقدة",
    collapseBranch: "طي الفرع",
    expandBranch: "فتح الفرع",
    bulkNodes: "إضافة فروع متعددة",
    bulkTitle: "إضافة عدة فروع دفعة واحدة",
    bulkDescription:
      "اكتب كل عنصر في سطر منفصل، أو افصل بين العناصر بفاصلة. سيتم إنشاء عقدة فرعية لكل عنصر وربطها بالعقدة الرئيسية المحددة.",
    bulkPlaceholder: "HTML\nCSS\nJavaScript\nReact",
    bulkCreate: "إنشاء الفروع",
    bulkCount: "عناصر جاهزة للإضافة",
    selectParentHint:
      "اضغط على عقدة أولاً لتحديدها كمجموعة رئيسية للفروع الجديدة.",
    selectedParent: "العقدة الرئيسية المحددة",
    mapInstructions:
      "اضغط على عقدة لتحديدها كعقدة رئيسية. اسحب بين نقاط الاتصال لربط العقد، واضغط مرتين على العقدة لتعديلها.",
    newTopic: "موضوع جديد",
    topicName: "اسم الموضوع",
    lesson: "إضافة درس",
    lessonName: "عنوان الدرس",
    noTopics: "لا توجد مواضيع تعلم بعد.",
    newProject: "مشروع جديد",
    task: "إضافة مهمة",
    taskPlaceholder: "اسم المهمة",
    todo: "قيد الانتظار",
    doing: "قيد التنفيذ",
    done: "مكتمل",
    noProjects: "لا توجد مشاريع بعد.",
    active: "نشط",
    completed: "مكتمل",
    delete: "حذف",
    edit: "تعديل",
    clear: "حذف جميع البيانات",
    confirm: "هل أنت متأكد؟",
    appearance: "المظهر",
    language: "اللغة",
    light: "فاتح",
    dark: "داكن",
    english: "الإنجليزية",
    arabic: "العربية",
    data: "بياناتك",
    export: "تصدير البيانات",
    reset: "إعادة ضبط مساحة العمل",
    move: "اسحب لتحريك",
    back: "رجوع",
    noDescription: "لا يوجد وصف",
    created: "تاريخ الإنشاء",
    tasks: "المهام",
    noTasks: "لا توجد مهام بعد",
    progress: "الإنجاز",
    welcomeBack: "أهلاً بك في مدار",
    add: "إضافة",
    saveChanges: "حفظ التعديلات",
  },
};

// ================================================================
// 04) SIDEBAR NAVIGATION — عناصر القائمة الجانبية
// ================================================================
// id هو اسم الصفحة الداخلي، و icon هي الأيقونة التي تظهر بجانبها.
const navItems = [
  { id: "dashboard", icon: LayoutDashboard },
  { id: "ideas", icon: Lightbulb },
  { id: "maps", icon: Brain },
  { id: "learning", icon: BookOpen },
  { id: "projects", icon: FolderKanban },
];

// ================================================================
// 05) HELPERS — دوال مساعدة مشتركة
// ================================================================
// إنشاء معرّف مختلف لكل فكرة أو خريطة أو عقدة أو مشروع أو مهمة.
const uid = () =>
  Date.now().toString() + Math.random().toString(16).slice(2, 6);

// ---------------------------------------------------------------
// تقسيم النص الذي يلصقه المستخدم إلى أسماء عقد متعددة.
// ندعم: الأسطر الجديدة، الفاصلة الإنجليزية والعربية، والفاصلة المنقوطة.
// كما نحذف رموز التعداد الشائعة مثل: - أو * أو • من بداية السطر.
// ونزيل التكرار حتى لا ننشئ عقدتين بالاسم نفسه من النص الملصق.
// ---------------------------------------------------------------
function parseBulkNodeNames(value) {
  const uniqueNames = new Map();

  value
    .split(/[\n\r,،;；؛\t]+/)
    .map((item) => item.replace(/^\s*[•*\-]+\s*/, "").trim())
    .filter(Boolean)
    .forEach((name) => {
      const key = name.toLocaleLowerCase();
      if (!uniqueNames.has(key)) uniqueNames.set(key, name);
    });

  return Array.from(uniqueNames.values());
}

// ---------------------------------------------------------------
// قراءة البيانات المحفوظة من المتصفح عند تشغيل مدار.
// إذا لم توجد بيانات أو حدث خطأ في قراءة JSON، نبدأ ببيانات فارغة.
// ---------------------------------------------------------------
function readData() {
  try {
    return {
      ...initialData,
      ...JSON.parse(localStorage.getItem("orbita-data") || "{}"),
    };
  } catch {
    return initialData;
  }
}

// ================================================================
// 06) MAIN APP — المكوّن الرئيسي الذي يجمع مدار بالكامل
// ================================================================
export default function App() {
  // --------------------------------------------------------------
  // 06.1) APPLICATION STATE — الحالات الرئيسية للتطبيق
  // data: جميع الأفكار والخرائط ومواضيع التعلم والمشاريع.
  // language/theme: لغة التطبيق ومظهره.
  // page: الصفحة المفتوحة حالياً.
  // selected...: العنصر المفتوح داخل قسمه، مثل خريطة أو مشروع.
  // --------------------------------------------------------------
  const [data, setData] = useState(readData);
  const [language, setLanguage] = useState(
    () => localStorage.getItem("orbita-language") || "en",
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("orbita-theme") || "light",
  );
  const [page, setPage] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [mapNameModalOpen, setMapNameModalOpen] = useState(false);
  const [newMapName, setNewMapName] = useState("");
  const [dialog, setDialog] = useState(null);

  const t = words[language];
  const rtl = language === "ar";

  // نافذة موحدة داخل ORBITA لكل عمليات الإدخال والتأكيد والتنبيه.
  const openDialog = (config) => {
    const fields = config.fields || [];
    const values = Object.fromEntries(
      fields.map((field) => [field.name, field.defaultValue ?? ""]),
    );
    setDialog({ type: "form", ...config, fields, values });
  };
  const closeDialog = () => setDialog(null);
  const updateDialogValue = (name, value) => {
    setDialog((current) =>
      current
        ? { ...current, values: { ...current.values, [name]: value } }
        : current,
    );
  };
  const submitDialog = (event) => {
    event.preventDefault();
    if (!dialog) return;
    const current = dialog;
    setDialog(null);
    current.onSubmit?.(current.values || {});
  };
  const confirmDialog = () => {
    if (!dialog) return;
    const current = dialog;
    setDialog(null);
    current.onConfirm?.();
  };

  useEffect(() => {
    if (!dialog) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeDialog();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialog]);

  // --------------------------------------------------------------
  // 06.2) AUTO SAVE — حفظ بيانات مدار تلقائياً
  // كلما تغيرت data، نحفظ نسخة جديدة في LocalStorage.
  // --------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem("orbita-data", JSON.stringify(data));
  }, [data]);

  // --------------------------------------------------------------
  // 06.3) LANGUAGE & THEME — تطبيق اللغة والاتجاه والمظهر
  // عند تغيير اللغة نضبط dir إلى rtl للعربية أو ltr للإنجليزية.
  // كما نحفظ اللغة والمظهر حتى يبقيا بعد تحديث الصفحة.
  // --------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem("orbita-language", language);
    localStorage.setItem("orbita-theme", theme);
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = theme;
  }, [language, theme, rtl]);

  // --------------------------------------------------------------
  // 06.4) SHARED ACTIONS — دوال تعديل البيانات والتنقل
  // update تعدّل قائمة واحدة داخل البيانات.
  // go تنتقل إلى صفحة أخرى وتغلق التفاصيل المفتوحة والقائمة الجانبية.
  // --------------------------------------------------------------
  const update = (key, value) => setData((prev) => ({ ...prev, [key]: value }));
  const go = (next) => {
    setPage(next);
    setSearch("");
    setMobileMenu(false);
    setSelectedMap(null);
    setSelectedTopic(null);
    setSelectedProject(null);
  };

  // --------------------------------------------------------------
  // 06.5) ADD IDEA — إضافة فكرة جديدة
  // --------------------------------------------------------------
  const addIdea = () =>
    openDialog({
      title: t.newIdea,
      description: rtl
        ? "أضف فكرة جديدة إلى مساحتك."
        : "Add a new idea to your workspace.",
      fields: [
        {
          name: "title",
          label: t.title,
          placeholder: t.ideaPlaceholder,
          required: true,
        },
        {
          name: "description",
          label: t.description,
          type: "textarea",
          placeholder: rtl
            ? "اكتب وصفًا مختصرًا..."
            : "Add a short description...",
        },
      ],
      submitLabel: t.add,
      onSubmit: ({ title, description }) => {
        if (!title?.trim()) return;
        update("ideas", [
          {
            id: uid(),
            title: title.trim(),
            description: (description || "").trim(),
            date: new Date().toLocaleDateString(),
          },
          ...data.ideas,
        ]);
      },
    });

  // --------------------------------------------------------------
  // 06.6) ADD KNOWLEDGE MAP — إنشاء خريطة معرفية جديدة
  // نبدأ بعقدة رئيسية واحدة، وروابط فارغة.
  // --------------------------------------------------------------
  const addMap = () => {
    setNewMapName("");
    setMapNameModalOpen(true);
  };

  const createMap = (event) => {
    event.preventDefault();
    const name = newMapName.trim();
    if (!name) return;
    const map = {
      id: uid(),
      name,
      nodes: [{ id: uid(), text: name, x: 300, y: 200 }],
      edges: [],
    };
    update("maps", [map, ...data.maps]);
    setSelectedMap(map.id);
    setMapNameModalOpen(false);
    setNewMapName("");
  };

  // --------------------------------------------------------------
  // 06.7) ADD LEARNING TOPIC — إنشاء موضوع تعلم جديد
  // --------------------------------------------------------------
  const addTopic = () =>
    openDialog({
      title: t.newTopic,
      fields: [
        {
          name: "name",
          label: t.topicName,
          placeholder: rtl ? "مثلاً: JavaScript" : "e.g. JavaScript",
          required: true,
        },
      ],
      submitLabel: t.create,
      onSubmit: ({ name }) => {
        if (!name?.trim()) return;
        const topic = { id: uid(), name: name.trim(), lessons: [] };
        update("learning", [topic, ...data.learning]);
        setSelectedTopic(topic.id);
      },
    });

  // --------------------------------------------------------------
  // 06.8) ADD PROJECT — إنشاء مشروع جديد
  // --------------------------------------------------------------
  const addProject = () =>
    openDialog({
      title: t.newProject,
      fields: [
        {
          name: "name",
          label: t.title,
          placeholder: rtl ? "اكتب اسم المشروع..." : "Enter project name...",
          required: true,
        },
      ],
      submitLabel: t.create,
      onSubmit: ({ name }) => {
        if (!name?.trim()) return;
        const project = { id: uid(), name: name.trim(), tasks: [] };
        update("projects", [project, ...data.projects]);
        setSelectedProject(project.id);
      },
    });

  // --------------------------------------------------------------
  // 06.9) DELETE ITEM — حذف عنصر من إحدى القوائم الرئيسية
  // نطلب التأكيد أولاً ثم نحذف العنصر الذي يحمل المعرّف المطلوب.
  // --------------------------------------------------------------
  const removeItem = (key, id) => {
    const item = data[key].find((entry) => entry.id === id);
    if (!item) return;
    openDialog({
      type: "confirm",
      title: rtl ? "تأكيد الحذف" : "Confirm deletion",
      description: rtl
        ? `هل تريد حذف «${item.name || item.title}»؟ لا يمكن التراجع عن هذا الإجراء.`
        : `Delete “${item.name || item.title}”? This action cannot be undone.`,
      confirmLabel: t.delete,
      onConfirm: () =>
        update(
          key,
          data[key].filter((entry) => entry.id !== id),
        ),
    });
  };

  // --------------------------------------------------------------
  // 06.10) EXPORT DATA — تنزيل نسخة احتياطية من بيانات المستخدم
  // --------------------------------------------------------------
  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "orbita-backup.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // --------------------------------------------------------------
  // 06.11) IMPORT DATA — استعادة نسخة احتياطية من ملف JSON
  // --------------------------------------------------------------
  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        openDialog({
          type: "confirm",
          title: rtl ? "استعادة النسخة الاحتياطية؟" : "Restore backup?",
          description: rtl
            ? "سيتم استبدال بيانات مساحة العمل الحالية بالبيانات الموجودة في الملف."
            : "Your current workspace data will be replaced with the data in this backup.",
          confirmLabel: rtl ? "استعادة" : "Restore",
          onConfirm: () => setData({ ...initialData, ...imported }),
        });
      } catch {
        openDialog({
          type: "alert",
          title: rtl ? "ملف غير صالح" : "Invalid file",
          description: rtl
            ? "تعذر قراءة ملف النسخة الاحتياطية. تأكد من اختيار ملف JSON صحيح."
            : "The backup file could not be read. Please choose a valid JSON file.",
        });
      }
    };
    reader.readAsText(file);
  };

  // --------------------------------------------------------------
  // 06.12) DASHBOARD STATS — الأرقام الظاهرة في الصفحة الرئيسية
  // --------------------------------------------------------------
  const stats = [
    { label: t.ideasCount, value: data.ideas.length, icon: Lightbulb },
    { label: t.mapsCount, value: data.maps.length, icon: Brain },
    { label: t.learningCount, value: data.learning.length, icon: BookOpen },
    { label: t.projectsCount, value: data.projects.length, icon: FolderKanban },
  ];

  // ================================================================
  // 07) DASHBOARD — الصفحة الرئيسية والإحصائيات والنشاط الأخير
  // ================================================================
  const renderDashboard = () => (
    <>
      {/* بطاقة الترحيب بالمستخدم */}
      <section className="welcome">
        <div>
          <p className="eyebrow">{t.greeting}</p>
          <h1>{t.welcome}</h1>
          <p>{t.subtitle}</p>
        </div>
      </section>

      {/* بطاقات الإحصائيات الأربع: الأفكار والخرائط والتعلم والمشاريع */}
      <section className="stats-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="stat-card" key={label}>
            <div className="stat-top">
              <span>{label}</span>
              <Icon size={19} />
            </div>
            <h2>{String(value).padStart(2, "0")}</h2>
          </div>
        ))}
      </section>

      {/* النشاط الأخير وروابط الوصول السريع إلى الأقسام */}
      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-heading">
            <h3>{t.recent}</h3>
            <Clock size={18} />
          </div>
          <div className="recent-list">
            {[
              ...data.ideas
                .slice(0, 3)
                .map((i) => ({
                  name: i.title,
                  icon: Lightbulb,
                  type: t.ideas,
                })),
              ...data.projects
                .slice(0, 2)
                .map((i) => ({
                  name: i.name,
                  icon: FolderKanban,
                  type: t.projects,
                })),
            ]
              .slice(0, 5)
              .map((item, index) => (
                <div className="recent-item" key={index}>
                  <span className="small-icon">
                    <item.icon size={17} />
                  </span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.type}</small>
                  </div>
                </div>
              ))}
            {data.ideas.length === 0 && data.projects.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <CheckCircle2 />
                </div>
                <h3>{t.empty}</h3>
                <p>{t.start}</p>
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h3>{t.quick}</h3>
            <ArrowUpRight size={18} />
          </div>
          {navItems.slice(1).map(({ id, icon: Icon }) => (
            <button className="quick-item" key={id} onClick={() => go(id)}>
              <Icon size={18} />
              <span>{t[id]}</span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>
    </>
  );

  // ================================================================
  // 08) IDEAS — عرض الأفكار والبحث فيها وإضافة فكرة جديدة
  // ================================================================
  const renderIdeas = () => {
    const filtered = data.ideas.filter((i) =>
      `${i.title} ${i.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
    return (
      <section>
        <div className="page-heading">
          <div>
            <h1>{t.ideas}</h1>
            <p>{t.subtitle}</p>
          </div>
          <button className="primary-btn" onClick={addIdea}>
            <Plus size={17} />
            {t.newIdea}
          </button>
        </div>
        <div className="search-box">
          <Search size={17} />
          <input
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="cards-grid">
          {filtered.map((idea) => (
            <div className="idea-card unified-card" key={idea.id}>
              <div className="card-actions">
                <button onClick={() => removeItem("ideas", idea.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <span className="unified-card-icon">
                <Lightbulb size={20} />
              </span>
              <div className="unified-card-content">
                <h3>{idea.title}</h3>
                <p>{idea.description || t.noDescription}</p>
                <small>{idea.date}</small>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <Empty icon={Lightbulb} title={t.noIdeas} text={t.addFirst} />
          )}
        </div>
      </section>
    );
  };

  // ================================================================
  // 09) KNOWLEDGE MAPS — قائمة الخرائط وفتح محرر الخريطة
  // ================================================================
  const renderMaps = () => {
    const map = data.maps.find((m) => m.id === selectedMap);
    if (map)
      return (
        <MapEditor
          map={map}
          t={t}
          rtl={rtl}
          onBack={() => setSelectedMap(null)}
          onUpdate={(updated) =>
            update(
              "maps",
              data.maps.map((m) => (m.id === map.id ? updated : m)),
            )
          }
          onDelete={() => {
            removeItem("maps", map.id);
            setSelectedMap(null);
          }}
        />
      );
    return (
      <section>
        <div className="page-heading">
          <div>
            <h1>{t.maps}</h1>
            <p>{t.subtitle}</p>
          </div>
          <button className="primary-btn" onClick={addMap}>
            <Plus size={17} />
            {t.newMap}
          </button>
        </div>
        <div className="cards-grid">
          {data.maps.map((map) => (
            <div
              className="map-card unified-card"
              key={map.id}
              onClick={() => setSelectedMap(map.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Space")
                  setSelectedMap(map.id);
              }}
            >
              <span className="unified-card-icon">
                <Brain size={20} />
              </span>
              <div className="card-actions map-card-actions">
                <button
                  aria-label="Delete map"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem("maps", map.id);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="unified-card-content">
                <h3>{map.name}</h3>
                <p>
                  {(map.nodes || []).length === 0
                    ? "Start building your knowledge map"
                    : `${(map.edges || []).length} connections`}
                </p>
                <small>{map.nodes?.length || 0} nodes</small>
              </div>
            </div>
          ))}
          {data.maps.length === 0 && (
            <Empty icon={Brain} title={t.mapEmpty} text={t.start} />
          )}
        </div>
      </section>
    );
  };

  // ================================================================
  // 12) LEARNING — قائمة مواضيع التعلم وفتح تفاصيل الموضوع
  // ================================================================
  const renderLearning = () => {
    const topic = data.learning.find((x) => x.id === selectedTopic);
    if (topic)
      return (
        <TopicEditor
          topic={topic}
          t={t}
          rtl={rtl}
          openDialog={openDialog}
          onBack={() => setSelectedTopic(null)}
          onUpdate={(updated) =>
            update(
              "learning",
              data.learning.map((x) => (x.id === topic.id ? updated : x)),
            )
          }
          onDelete={() => {
            removeItem("learning", topic.id);
            setSelectedTopic(null);
          }}
        />
      );
    return (
      <section>
        <div className="page-heading">
          <div>
            <h1>{t.learning}</h1>
            <p>{t.subtitle}</p>
          </div>
          <button className="primary-btn" onClick={addTopic}>
            <Plus size={17} />
            {t.newTopic}
          </button>
        </div>
        <div className="cards-grid">
          {data.learning.map((topic) => (
            <div
              className="topic-card unified-card"
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
            >
              <span className="unified-card-icon">
                <BookOpen size={20} />
              </span>
              <button
                className="delete-inline"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem("learning", topic.id);
                }}
              >
                <Trash2 size={16} />
              </button>
              <div className="unified-card-content">
                <h3>{topic.name}</h3>
                <p>{topic.lessons.length} lessons</p>
              </div>
            </div>
          ))}
          {data.learning.length === 0 && (
            <Empty icon={BookOpen} title={t.noTopics} text={t.start} />
          )}
        </div>
      </section>
    );
  };

  // ================================================================
  // 13) PROJECTS — قائمة المشاريع وفتح لوحة مهام المشروع
  // ================================================================
  const renderProjects = () => {
    const project = data.projects.find((p) => p.id === selectedProject);
    if (project)
      return (
        <ProjectEditor
          project={project}
          t={t}
          rtl={rtl}
          openDialog={openDialog}
          onBack={() => setSelectedProject(null)}
          onUpdate={(updated) =>
            update(
              "projects",
              data.projects.map((p) => (p.id === project.id ? updated : p)),
            )
          }
          onDelete={() => {
            removeItem("projects", project.id);
            setSelectedProject(null);
          }}
        />
      );
    return (
      <section>
        <div className="page-heading">
          <div>
            <h1>{t.projects}</h1>
            <p>{t.subtitle}</p>
          </div>
          <button className="primary-btn" onClick={addProject}>
            <Plus size={17} />
            {t.newProject}
          </button>
        </div>
        <div className="cards-grid">
          {data.projects.map((project) => (
            <div
              className="project-card unified-card"
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
            >
              <span className="unified-card-icon">
                <FolderKanban size={20} />
              </span>
              <div className="card-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem("projects", project.id);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="unified-card-content">
                <h3>{project.name}</h3>
                <p>
                  {project.tasks.length} {t.tasks}
                </p>
                <Progress tasks={project.tasks} />
              </div>
            </div>
          ))}
          {data.projects.length === 0 && (
            <Empty icon={FolderKanban} title={t.noProjects} text={t.start} />
          )}
        </div>
      </section>
    );
  };

  // ================================================================
  // 14) SETTINGS — إعداد اللغة والمظهر واستيراد وتصدير البيانات
  // ================================================================
  const renderSettings = () => (
    <section>
      <div className="page-heading">
        <div>
          <h1>{t.settings}</h1>
          <p>{t.subtitle}</p>
        </div>
      </div>
      <div className="settings-wrap">
        <div className="panel settings-panel">
          <div className="settings-title">
            <Settings />
            <div>
              <h3>{t.appearance}</h3>
              <p>{t.subtitle}</p>
            </div>
          </div>
          <div className="setting-row">
            <div>
              <strong>{t.appearance}</strong>
              <small>
                {t.light} / {t.dark}
              </small>
            </div>
            <div className="segmented">
              <button
                className={theme === "light" ? "selected" : ""}
                onClick={() => setTheme("light")}
              >
                <Sun size={16} />
                {t.light}
              </button>
              <button
                className={theme === "dark" ? "selected" : ""}
                onClick={() => setTheme("dark")}
              >
                <Moon size={16} />
                {t.dark}
              </button>
            </div>
          </div>
          <div className="setting-row">
            <div>
              <strong>{t.language}</strong>
              <small>
                {t.english} / {t.arabic}
              </small>
            </div>
            <div className="segmented">
              <button
                className={language === "en" ? "selected" : ""}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
              <button
                className={language === "ar" ? "selected" : ""}
                onClick={() => setLanguage("ar")}
              >
                AR
              </button>
            </div>
          </div>
        </div>
        <div className="panel settings-panel">
          <div className="settings-title">
            <Download />
            <div>
              <h3>{t.data}</h3>
              <p>Your workspace data is stored locally in your browser.</p>
            </div>
          </div>
          <div className="setting-row">
            <div>
              <strong>{t.export}</strong>
              <small>Download a backup of your data</small>
            </div>
            <button className="secondary-btn" onClick={exportData}>
              <Download size={16} />
              {t.export}
            </button>
          </div>
          <div className="setting-row">
            <div>
              <strong>Import Backup</strong>
              <small>Restore a previous backup file</small>
            </div>
            <label className="secondary-btn">
              <Upload size={16} />
              Import
              <input type="file" accept=".json" hidden onChange={importData} />
            </label>
          </div>
          <div className="setting-row danger-row">
            <div>
              <strong>{t.reset}</strong>
              <small>Remove all locally stored Orbita data</small>
            </div>
            <button
              className="danger-btn"
              onClick={() =>
                openDialog({
                  type: "confirm",
                  title: t.reset,
                  description: rtl
                    ? "سيتم حذف جميع بيانات مدار المحفوظة على هذا المتصفح. هل تريد المتابعة؟"
                    : "All Orbita data saved in this browser will be removed. Continue?",
                  confirmLabel: t.clear,
                  onConfirm: () => setData(initialData),
                })
              }
            >
              <Trash2 size={16} />
              {t.clear}
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  // --------------------------------------------------------------
  // اختيار الصفحة التي يجب عرضها حسب قيمة page الحالية.
  // --------------------------------------------------------------
  const content = {
    dashboard: renderDashboard,
    ideas: renderIdeas,
    maps: renderMaps,
    learning: renderLearning,
    projects: renderProjects,
    settings: renderSettings,
  };

  // ================================================================
  // 15) MAIN LAYOUT — الهيكل العام: القائمة، الشريط العلوي، والمحتوى
  // ================================================================
  return (
    <div className="app-shell">
      {mobileMenu && (
        <div className="mobile-overlay" onClick={() => setMobileMenu(false)} />
      )}
      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Orbit size={24} />
          </div>
          <span>ORBITA</span>
          <button className="close-menu" onClick={() => setMobileMenu(false)}>
            <X />
          </button>
        </div>
        <p className="nav-label">
          {language === "ar" ? "مساحة العمل" : "WORKSPACE"}
        </p>
        <nav>
          {navItems.map(({ id, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              onClick={() => go(id)}
            >
              <Icon size={19} />
              <span>{t[id]}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            className={`nav-item ${page === "settings" ? "active" : ""}`}
            onClick={() => go("settings")}
          >
            <Settings size={19} />
            <span>{t.settings}</span>
          </button>
          <div className="sidebar-note">
            <Orbit size={20} />
            <p>Make space for what matters.</p>
          </div>
        </div>
      </aside>

      <main className="main-area">
        {/* الشريط العلوي: زر قائمة الهاتف، اسم الصفحة، اللغة والمظهر */}
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileMenu(true)}>
            <Menu />
          </button>
          <div className="breadcrumb">ORBITA / {t[page]}</div>
          <div className="top-actions">
            <button
              className="icon-btn"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              title="Theme"
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>
            <button
              className="language-btn"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            >
              {language === "en" ? "عربي" : "English"}
            </button>
            <div className="avatar">O</div>
          </div>
        </header>

        {/* محتوى الصفحة الحالية، يتم اختياره من content حسب page */}
        <div className="main-content">{content[page]()}</div>
        <footer>ORBITA © 2026 · Your personal space</footer>
      </main>

      {/* نافذة إنشاء خريطة داخل الموقع بدل نافذة prompt الافتراضية */}
      {mapNameModalOpen && (
        <div
          className="orbita-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget)
              setMapNameModalOpen(false);
          }}
        >
          <style>{`
            .app-shell .orbita-modal-overlay { position:fixed!important; inset:0!important; z-index:9999!important; display:flex!important; align-items:center!important; justify-content:center!important; padding:24px!important; background:rgba(12,15,14,.58)!important; backdrop-filter:blur(7px)!important; }
            .app-shell .orbita-modal-overlay .orbita-modal { width:min(440px,100%)!important; margin:0!important; padding:30px!important; border:1px solid var(--border,rgba(180,160,100,.22))!important; border-radius:22px!important; background:var(--surface,#fff)!important; color:var(--text,#222)!important; box-shadow:0 24px 80px rgba(0,0,0,.28)!important; display:flex!important; flex-direction:column!important; gap:12px!important; }
            .app-shell .orbita-modal .orbita-modal-mark { width:48px;height:48px;display:grid;place-items:center;border-radius:15px;background:rgba(193,164,86,.15);color:#b59a52;margin-bottom:2px; }
            .app-shell .orbita-modal h3 { margin:0!important; font-size:22px!important; line-height:1.3!important; font-weight:700!important; }
            .app-shell .orbita-modal p { margin:0 0 8px!important; font-size:14px!important; opacity:.7!important; line-height:1.6!important; }
            .app-shell .orbita-modal label { display:block!important; margin:2px 0 0!important; font-size:13px!important; font-weight:600!important; opacity:.85!important; }
            .app-shell .orbita-modal input { width:100%!important; box-sizing:border-box!important; padding:13px 15px!important; border:1px solid rgba(160,145,110,.35)!important; border-radius:12px!important; outline:none!important; background:var(--input-bg,var(--surface,#fff))!important; color:var(--text,#222)!important; font:inherit!important; font-size:15px!important; transition:border-color .2s,box-shadow .2s!important; }
            .app-shell .orbita-modal input:focus { border-color:#b79b52!important; box-shadow:0 0 0 3px rgba(183,155,82,.18)!important; }
            .app-shell .orbita-modal .modal-actions { display:flex!important; justify-content:flex-end!important; gap:10px!important; margin-top:12px!important; }
            .app-shell .orbita-modal .modal-actions button { min-width:105px!important; justify-content:center!important; padding:11px 16px!important; border-radius:11px!important; font-weight:600!important; }
            @media(max-width:480px){ .app-shell .orbita-modal-overlay .orbita-modal{padding:22px!important;border-radius:18px!important;} }
          `}</style>
          <form className="orbita-modal" onSubmit={createMap}>
            <div className="orbita-modal-mark">
              <Brain size={24} />
            </div>
            <h3>{t.newMap}</h3>
            <p>
              {language === "ar"
                ? "أنشئ خريطة جديدة لتنظيم أفكارك ومعرفتك."
                : "Create a new map to organize your ideas and knowledge."}
            </p>
            <label htmlFor="orbita-map-name">{t.mapName}</label>
            <input
              id="orbita-map-name"
              autoFocus
              value={newMapName}
              onChange={(event) => setNewMapName(event.target.value)}
              placeholder={
                language === "ar"
                  ? "مثلاً: تعلم HTML..."
                  : "e.g. Learning HTML..."
              }
              maxLength={80}
            />
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setMapNameModalOpen(false)}
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="primary-btn"
                disabled={!newMapName.trim()}
              >
                {t.create}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* نافذة عامة موحدة للأفكار والمشاريع والدروس والمهام والتأكيدات */}
      {dialog && (
        <div
          className="orbita-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <form
            className="orbita-dialog-card"
            onSubmit={
              dialog.type === "form"
                ? submitDialog
                : (event) => event.preventDefault()
            }
            dir={rtl ? "rtl" : "ltr"}
          >
            <div className="orbita-dialog-icon">
              <Orbit size={22} />
            </div>
            <h2>{dialog.title}</h2>
            {dialog.description && (
              <p className="orbita-dialog-description">{dialog.description}</p>
            )}
            {dialog.type === "form" &&
              dialog.fields?.map((field) => (
                <div className="orbita-dialog-field" key={field.name}>
                  <label htmlFor={`orbita-dialog-${field.name}`}>
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={`orbita-dialog-${field.name}`}
                      autoFocus={dialog.fields[0]?.name === field.name}
                      value={dialog.values[field.name] ?? ""}
                      placeholder={field.placeholder || ""}
                      required={Boolean(field.required)}
                      rows={4}
                      onChange={(event) =>
                        updateDialogValue(field.name, event.target.value)
                      }
                    />
                  ) : (
                    <input
                      id={`orbita-dialog-${field.name}`}
                      autoFocus={dialog.fields[0]?.name === field.name}
                      type={field.type || "text"}
                      value={dialog.values[field.name] ?? ""}
                      placeholder={field.placeholder || ""}
                      required={Boolean(field.required)}
                      maxLength={field.maxLength || 120}
                      onChange={(event) =>
                        updateDialogValue(field.name, event.target.value)
                      }
                    />
                  )}
                </div>
              ))}
            <div className="orbita-dialog-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={closeDialog}
              >
                {t.cancel || (rtl ? "إلغاء" : "Cancel")}
              </button>
              {dialog.type === "form" ? (
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={dialog.fields?.some(
                    (field) =>
                      field.required &&
                      !String(dialog.values[field.name] || "").trim(),
                  )}
                >
                  {dialog.submitLabel || t.save}
                </button>
              ) : dialog.type === "confirm" ? (
                <button
                  type="button"
                  className="danger-btn"
                  onClick={confirmDialog}
                >
                  {dialog.confirmLabel || t.confirm}
                </button>
              ) : (
                <button
                  type="button"
                  className="primary-btn"
                  onClick={closeDialog}
                >
                  {rtl ? "حسنًا" : "OK"}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <style>{`
        .app-shell .orbita-dialog-backdrop { position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; padding:22px; background:rgba(11,13,12,.58); backdrop-filter:blur(7px); }
        .app-shell .orbita-dialog-card { width:min(470px,100%); max-height:min(85vh,700px); overflow:auto; display:flex; flex-direction:column; gap:13px; margin:0; padding:28px; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:20px; box-shadow:0 24px 80px rgba(0,0,0,.28); }
        .app-shell .orbita-dialog-icon { width:44px; height:44px; display:grid; place-items:center; border-radius:14px; color:var(--primary); background:var(--primary-soft); }
        .app-shell .orbita-dialog-card h2 { margin:0; color:var(--text); font-size:21px; line-height:1.35; }
        .app-shell .orbita-dialog-description { margin:0; color:var(--muted); font-size:13px; line-height:1.7; }
        .app-shell .orbita-dialog-field { display:flex; flex-direction:column; gap:7px; }
        .app-shell .orbita-dialog-field label { color:var(--text); font-size:13px; font-weight:600; }
        .app-shell .orbita-dialog-field input,.app-shell .orbita-dialog-field textarea { width:100%; box-sizing:border-box; padding:12px 13px; border:1px solid var(--border); border-radius:11px; outline:none; background:var(--surface2); color:var(--text); font:inherit; font-size:14px; }
        .app-shell .orbita-dialog-field textarea { resize:vertical; min-height:100px; line-height:1.6; }
        .app-shell .orbita-dialog-field input:focus,.app-shell .orbita-dialog-field textarea:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-soft); }
        .app-shell .orbita-dialog-actions { display:flex; justify-content:flex-end; flex-wrap:wrap; gap:9px; margin-top:8px; }
        .app-shell .orbita-dialog-actions button { min-height:40px; padding:10px 16px; border-radius:10px; }
        .app-shell .orbita-dialog-actions button:disabled { opacity:.45; cursor:not-allowed; }
        @media(max-width:520px) { .app-shell .orbita-dialog-card { padding:22px; border-radius:17px; } }
      `}</style>
    </div>
  );
}

// ================================================================
// 16) REUSABLE COMPONENTS — مكونات صغيرة يعاد استخدامها
// ================================================================
// Empty: رسالة موحدة تظهر عندما لا توجد بيانات في القسم.
function MapThumbnail({ nodes = [], edges = [] }) {
  const width = 320,
    height = 156,
    pad = 24;
  const visible = nodes.slice(0, 9);
  const points = visible.map((node, index) => {
    const x = typeof node.x === "number" ? node.x : 70 + (index % 3) * 90;
    const y =
      typeof node.y === "number" ? node.y : 55 + Math.floor(index / 3) * 42;
    return { id: node.id, label: node.text || "Node", x, y };
  });
  const minX = Math.min(...points.map((p) => p.x), 0),
    maxX = Math.max(...points.map((p) => p.x), 1);
  const minY = Math.min(...points.map((p) => p.y), 0),
    maxY = Math.max(...points.map((p) => p.y), 1);
  const mapped = points.map((p) => ({
    ...p,
    sx: pad + ((p.x - minX) / (maxX - minX || 1)) * (width - pad * 2),
    sy: pad + ((p.y - minY) / (maxY - minY || 1)) * (height - pad * 2),
  }));
  const byId = Object.fromEntries(mapped.map((p) => [p.id, p]));
  const mappedEdges = edges
    .filter((e) => byId[e.source] && byId[e.target])
    .slice(0, 14);
  return (
    <div className="map-preview map-thumbnail" aria-hidden="true">
      <svg viewBox={`0 0 ${width} ${height}`} className="map-thumbnail-svg">
        {mappedEdges.map((edge) => (
          <line
            key={edge.id || `${edge.source}-${edge.target}`}
            x1={byId[edge.source].sx}
            y1={byId[edge.source].sy}
            x2={byId[edge.target].sx}
            y2={byId[edge.target].sy}
            className="map-thumbnail-edge"
          />
        ))}
        {mapped.map((p, index) => (
          <g
            key={p.id}
            className={`map-thumbnail-node ${index === 0 ? "is-root" : ""}`}
            transform={`translate(${p.sx} ${p.sy})`}
          >
            <rect
              x={-Math.min(42, Math.max(24, p.label.length * 3.4))}
              y={-9}
              width={Math.min(84, Math.max(48, p.label.length * 6.8))}
              height={18}
              rx={6}
            />
            <text textAnchor="middle" dominantBaseline="central">
              {p.label.length > 12 ? `${p.label.slice(0, 11)}…` : p.label}
            </text>
          </g>
        ))}
        {nodes.length > 9 && (
          <text
            className="map-thumbnail-more"
            x={width - 12}
            y={height - 8}
            textAnchor="end"
          >
            +{nodes.length - 9}
          </text>
        )}
      </svg>
      {nodes.length === 0 && (
        <div className="map-thumbnail-empty">
          <span className="map-thumbnail-empty-dot" />
          <span>Create your first node</span>
        </div>
      )}
    </div>
  );
}

function Empty({ icon: Icon, title, text }) {
  return (
    <div className="empty-state full-empty">
      <div className="empty-icon">
        <Icon size={26} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

// Progress: شريط يوضح نسبة المهام المكتملة داخل المشروع.
function Progress({ tasks }) {
  const done = tasks.filter((t) => t.status === "done").length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>Progress</span>
        <span>{percent}%</span>
      </div>
      <div className="progress-bar">
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

// ================================================================
// 17) CUSTOM MAP NODE — شكل العقدة الواحدة داخل الخريطة
// ================================================================
// هذه ليست صفحة كاملة؛ إنها شكل بطاقة العقدة التي تظهر داخل React Flow.
// كل عقدة تحتوي على:
// 1. اسم الفكرة.
// 2. نقطة علوية لاستقبال اتصال من عقدة أخرى (target).
// 3. نقطة سفلية لإرسال اتصال إلى عقدة أخرى (source).
// 4. زر تعديل الاسم.
// 5. زر حذف العقدة.
//
// نستخدم className="nodrag nopan" على الأزرار حتى لا يعتبر React Flow
// الضغط على زر التعديل أو الحذف محاولة لسحب الخريطة أو تحريك العقدة.
// ================================================================
const nodeColorOptions = {
  gold: { bg: "#f4e7bf", border: "#c9a85e", text: "#59451b" },
  blue: { bg: "#dcecff", border: "#76a9e5", text: "#23466e" },
  green: { bg: "#dff3e5", border: "#79bd91", text: "#28553a" },
  pink: { bg: "#ffe2eb", border: "#dc91b0", text: "#70334d" },
  purple: { bg: "#eae1ff", border: "#aa91dc", text: "#4c3974" },
  orange: { bg: "#ffead5", border: "#dfaa71", text: "#744b23" },
  gray: { bg: "#e8e8e8", border: "#aaaaaa", text: "#444444" },
};

function CustomMapNode({ id, data }) {
  return (
    <div
      className={`orbita-node ${data.isSelectedParent ? "orbita-node-selected" : ""}`}
      style={{
        ...(data.isSelectedParent
          ? { outline: "2px solid var(--primary)", outlineOffset: "3px" }
          : {}),
        background: nodeColorOptions[data.nodeColor || "gold"]?.bg || "#f4e7bf",
        borderColor:
          nodeColorOptions[data.nodeColor || "gold"]?.border || "#c9a85e",
        color: nodeColorOptions[data.nodeColor || "gold"]?.text || "#59451b",
        borderRadius:
          data.nodeShape === "pill"
            ? "999px"
            : data.nodeShape === "square"
              ? "3px"
              : data.nodeShape === "hex"
                ? "8px"
                : "12px",
        clipPath:
          data.nodeShape === "hex"
            ? "polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)"
            : undefined,
      }}
    >
      {/* نقطة استقبال الخط القادم من عقدة أخرى */}
      <Handle id="target-left" type="target" position={Position.Left} />
      <Handle id="target-right" type="target" position={Position.Right} />

      {/* اسم العقدة */}
      <span className="orbita-node-label">{data.label}</span>

      {/* أدوات التحكم داخل العقدة: طي/فتح الفرع، تعديل الاسم، حذف العقدة */}
      <div
        className="orbita-node-actions"
        style={{ display: "flex", alignItems: "center", gap: "5px" }}
      >
        {data.hasChildren && (
          <button
            type="button"
            className="nodrag nopan"
            title={data.isCollapsed ? data.expandLabel : data.collapseLabel}
            aria-label={
              data.isCollapsed ? data.expandLabel : data.collapseLabel
            }
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              data.onToggleCollapse?.(id);
            }}
            style={{
              border: 0,
              background: "transparent",
              color: "var(--muted)",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              padding: "4px",
            }}
          >
            {data.isCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
            {data.hiddenCount > 0 && data.isCollapsed && (
              <span style={{ fontSize: "9px", lineHeight: 1 }}>
                {data.hiddenCount}
              </span>
            )}
          </button>
        )}
        <button
          type="button"
          className="nodrag nopan"
          title={data.editLabel}
          aria-label={data.editLabel}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            data.onEdit?.(id);
          }}
          style={{
            border: 0,
            background: "transparent",
            color: "var(--muted)",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            padding: "4px",
          }}
        >
          <Pencil size={14} />
        </button>

        <button
          type="button"
          className="nodrag nopan"
          title={data.deleteLabel}
          aria-label={data.deleteLabel}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            data.onDelete?.(id);
          }}
          style={{
            border: 0,
            background: "transparent",
            color: "var(--danger)",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            padding: "4px",
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* نقطة إرسال الخط إلى عقدة أخرى */}
      <Handle id="source-left" type="source" position={Position.Left} />
      <Handle id="source-right" type="source" position={Position.Right} />
    </div>
  );
}

// React Flow يحتاج إلى ربط اسم نوع العقدة بالمكوّن الذي يرسمها.
// نعرّف هذا الكائن خارج MapEditor حتى لا يتغير في كل عملية render.
const nodeTypes = {
  orbita: CustomMapNode,
};

// ================================================================
// 18) MAP EDITOR — محرر الخرائط المعرفية
// ================================================================
// هذه هي المساحة التي يعمل فيها المستخدم على خريطته.
// الوظائف الموجودة هنا:
// - عرض العقد الموجودة مسبقاً.
// - إضافة عقدة من نافذة داخل التطبيق، وليس من نافذة المتصفح prompt.
// - تعديل اسم عقدة موجودة.
// - حذف عقدة مع حذف كل الخطوط المرتبطة بها.
// - ربط العقد بالسحب من نقطة إلى نقطة.
// - تحريك العقد مع بقاء الخطوط متصلة بها.
// - حذف عقدة أو خط محدد باستخدام Delete أو Backspace.
// - حفظ مواقع العقد والروابط في بيانات الخريطة.
// ================================================================
// ترتيب تلقائي متوازن للخريطة.
// بدلاً من وضع جميع الأبناء في صف أفقي واحد، نقسم أبناء كل عقدة
// إلى مجموعات من أربعة أعمدة، ثم نضع كل مجموعة في صف مستقل.
// كما نحجز لكل فرع المساحة التي يحتاجها أبناؤه حتى لا تتداخل الفروع.
function autoArrangeMapNodes(nodes, edges) {
  if (!nodes.length) return nodes;
  // Compact balanced tree: each subtree reserves only the vertical space it needs.
  const NODE_W = 170,
    NODE_H = 54,
    X_GAP = 230,
    Y_GAP = 78,
    SIBLING_GAP = 34;
  const valid = new Set(nodes.map((n) => n.id));
  const children = new Map(nodes.map((n) => [n.id, []]));
  const parentOf = new Map();
  (edges || []).forEach((edge) => {
    if (
      edge.source === edge.target ||
      !valid.has(edge.source) ||
      !valid.has(edge.target)
    )
      return;
    if (!parentOf.has(edge.target)) {
      parentOf.set(edge.target, edge.source);
      children.get(edge.source).push(edge.target);
    }
  });
  const roots = nodes.filter((n) => !parentOf.has(n.id));
  const rootId = roots[0]?.id || nodes[0].id;
  const spanMemo = new Map();
  function span(id, path = new Set()) {
    if (path.has(id)) return Y_GAP;
    if (spanMemo.has(id)) return spanMemo.get(id);
    const next = new Set(path);
    next.add(id);
    const kids = (children.get(id) || []).filter((k) => !next.has(k));
    const size = kids.length
      ? Math.max(
          Y_GAP,
          kids.reduce((sum, k) => sum + span(k, next), 0) +
            SIBLING_GAP * (kids.length - 1),
        )
      : Y_GAP;
    spanMemo.set(id, size);
    return size;
  }
  const positions = new Map();
  positions.set(rootId, { x: 0, y: 0 });
  function place(id, side, depth, centerY, path = new Set()) {
    if (positions.has(id) || path.has(id)) return;
    const next = new Set(path);
    next.add(id);
    positions.set(id, { x: side * depth * X_GAP, y: centerY });
    const kids = (children.get(id) || []).filter((k) => !next.has(k));
    if (!kids.length) return;
    const total =
      kids.reduce((sum, k) => sum + span(k, next), 0) +
      SIBLING_GAP * (kids.length - 1);
    let cursor = centerY - total / 2;
    kids.forEach((k) => {
      const h = span(k, next);
      place(k, side, depth + 1, cursor + h / 2, next);
      cursor += h + SIBLING_GAP;
    });
  }
  const rootKids = children.get(rootId) || [];
  let leftSize = 0,
    rightSize = 0;
  const left = [],
    right = [];
  rootKids.forEach((k) => {
    const h = span(k);
    if (leftSize <= rightSize) {
      left.push(k);
      leftSize += h;
    } else {
      right.push(k);
      rightSize += h;
    }
  });
  function placeSide(kids, side) {
    if (!kids.length) return;
    const total =
      kids.reduce((sum, k) => sum + span(k), 0) +
      SIBLING_GAP * (kids.length - 1);
    let cursor = -total / 2;
    kids.forEach((k) => {
      const h = span(k);
      place(k, side, 1, cursor + h / 2, new Set([rootId]));
      cursor += h + SIBLING_GAP;
    });
  }
  placeSide(left, -1);
  placeSide(right, 1);
  let extraY = Math.max(leftSize, rightSize) / 2 + 180;
  roots.slice(1).forEach((r) => {
    if (positions.has(r.id)) return;
    positions.set(r.id, { x: 0, y: extraY });
    const kids = children.get(r.id) || [],
      total =
        kids.reduce((sum, k) => sum + span(k), 0) +
        SIBLING_GAP * Math.max(0, kids.length - 1);
    let cursor = extraY - total / 2;
    kids.forEach((k) => {
      const h = span(k);
      place(k, 1, 1, cursor + h / 2, new Set([r.id]));
      cursor += h + SIBLING_GAP;
    });
    extraY += span(r.id) + 140;
  });
  return nodes.map((n) => {
    const p = positions.get(n.id);
    return p
      ? {
          ...n,
          data: { ...n.data, layoutSide: p.x < 0 ? "left" : "right" },
          position: { x: p.x - NODE_W / 2, y: p.y - NODE_H / 2 },
        }
      : n;
  });
}

function MapEditor({ map, t, rtl, onBack, onUpdate, onDelete }) {
  // --------------------------------------------------------------
  // 11.1) تجهيز العقد المحفوظة وتحويلها إلى صيغة React Flow
  // --------------------------------------------------------------
  // البيانات القديمة في مدار تحفظ اسم العقدة وإحداثياتها باسم x و y.
  // React Flow يحتاج إلى position: { x, y } و data: { label }.
  // بعض الخرائط القديمة كانت تحفظ الموقع كنسبة مئوية صغيرة؛ لذلك
  // نحول القيم الصغيرة إلى مساحة أكبر حتى تظهر العقد بوضوح.
  const initialNodes = (map.nodes || []).map((node, index) => {
    const oldX = typeof node.x === "number" ? node.x : 250 + index * 60;
    const oldY = typeof node.y === "number" ? node.y : 180 + index * 50;

    const isOldPercentagePosition = oldX < 100 && oldY < 100;

    return {
      id: node.id,
      type: "orbita",
      position: {
        x: isOldPercentagePosition ? oldX * 7 : oldX,
        y: isOldPercentagePosition ? oldY * 5 : oldY,
      },
      data: {
        label: node.text || "New node",
        isCollapsed: node.isCollapsed || false,
        nodeColor: node.nodeColor || "gold",
        nodeShape: node.nodeShape || "rounded",
      },
    };
  });

  // --------------------------------------------------------------
  // 11.2) حالة العقد والروابط
  // --------------------------------------------------------------
  // useNodesState يدير العقد: تحريكها، تحديدها، وإضافة عقد جديدة.
  // useEdgesState يدير الخطوط التي تربط العقد ببعضها.
  // نقرأ الروابط القديمة إن وجدت، وإلا نبدأ بمصفوفة فارغة.
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(map.edges || []);
  // نحتفظ بمرجع React Flow حتى نعيد توسيط الخريطة بعد الترتيب التلقائي.
  const reactFlowInstanceRef = useRef(null);
  // Fit the requested visible nodes into the canvas without zooming too far in
  // or allowing the initial view to become excessively tiny.
  const fitMapToView = (duration = 300, targetNodes = null) => {
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => {
        const instance = reactFlowInstanceRef.current;
        if (!instance) return;
        const fitNodes = (targetNodes || nodes)
          .filter(Boolean)
          .map((node) => ({ id: node.id }));
        instance.fitView({
          ...(fitNodes.length ? { nodes: fitNodes } : {}),
          padding: 0.16,
          minZoom: 0.2,
          maxZoom: 0.95,
          duration,
        });
      }),
    );
  };

  // --------------------------------------------------------------
  // 11.3) حالة نافذة إضافة العقدة أو تعديلها
  // --------------------------------------------------------------
  // modalMode يحدد ما إذا كانت النافذة مغلقة أو في وضع الإضافة أو التعديل.
  // editingNodeId يحفظ رقم العقدة التي نريد تعديل اسمها.
  // nodeName يحفظ النص الذي يكتبه المستخدم داخل حقل الإدخال.
  const [modalMode, setModalMode] = useState(null); // null | "add" | "edit" | "bulk"
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [nodeName, setNodeName] = useState("");
  // إعدادات مظهر العقدة الحالية: لون وشكل.
  const [nodeColor, setNodeColor] = useState("gold");
  const [nodeShape, setNodeShape] = useState("rounded");

  // selectedParentId: رقم العقدة التي اختارها المستخدم لتكون أباً للفروع الجديدة.
  // bulkNodeText: النص الذي يلصقه المستخدم لإضافة عدة عقد دفعة واحدة.
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [bulkNodeText, setBulkNodeText] = useState("");
  const [collapsedNodeIds, setCollapsedNodeIds] = useState(
    () =>
      new Set(
        initialNodes
          .filter((node) => node.data.isCollapsed)
          .map((node) => node.id),
      ),
  );

  // نحول النص إلى قائمة أسماء فعلية، ونستخدمها للعداد ولعملية الإنشاء.
  const bulkNodeNames = parseBulkNodeNames(bulkNodeText);
  const selectedParentNode = nodes.find((node) => node.id === selectedParentId);

  // --------------------------------------------------------------
  // 11.4) فتح نافذة إضافة عقدة جديدة
  // --------------------------------------------------------------
  // نصفر حقل الاسم ثم نفتح النافذة بوضع الإضافة.
  const openAddNodeModal = () => {
    setNodeName("");
    setEditingNodeId(null);
    setNodeColor("gold");
    setNodeShape("rounded");
    setModalMode("add");
  };

  // --------------------------------------------------------------
  // 11.4.1) فتح نافذة إضافة عدة فروع تحت عقدة رئيسية
  // لا نسمح بفتحها قبل اختيار عقدة؛ لأن كل عقدة جديدة تحتاج إلى أب ترتبط به.
  // --------------------------------------------------------------
  const openBulkNodesModal = () => {
    if (!selectedParentId) return;
    setBulkNodeText("");
    setModalMode("bulk");
  };

  // --------------------------------------------------------------
  // 11.5) فتح نافذة تعديل اسم عقدة موجودة
  // --------------------------------------------------------------
  // نبحث عن العقدة المطلوبة، ونضع اسمها الحالي داخل حقل الإدخال.
  const openEditNodeModal = (nodeId) => {
    const nodeToEdit = nodes.find((node) => node.id === nodeId);
    if (!nodeToEdit) return;

    setEditingNodeId(nodeId);
    setNodeName(nodeToEdit.data.label || "");
    setNodeColor(nodeToEdit.data.nodeColor || "gold");
    setNodeShape(nodeToEdit.data.nodeShape || "rounded");
    setModalMode("edit");
  };

  // --------------------------------------------------------------
  // 11.6) إغلاق نافذة الإضافة أو التعديل
  // --------------------------------------------------------------
  // نغلق النافذة ونمسح بياناتها المؤقتة حتى تكون جاهزة للاستخدام التالي.
  const closeNodeModal = () => {
    setModalMode(null);
    setEditingNodeId(null);
    setNodeName("");
    setBulkNodeText("");
  };

  // --------------------------------------------------------------
  // 11.7) حفظ العقدة: إضافة جديدة أو تعديل عقدة موجودة
  // --------------------------------------------------------------
  // إذا كانت النافذة في وضع add ننشئ عقدة جديدة.
  // إذا كانت في وضع edit نغيّر اسم العقدة المحددة فقط.
  // لا نستخدم prompt؛ كل الإدخال يتم داخل نافذة من تصميم مدار.
  const saveNode = (event) => {
    event.preventDefault();

    const cleanName = nodeName.trim();
    if (!cleanName) return;

    if (modalMode === "add") {
      const newNode = {
        id: uid(),
        type: "orbita",
        // نوزع العقد الجديدة على أماكن مختلفة حتى لا تتكدس فوق بعضها.
        position: {
          x: 260 + (nodes.length % 3) * 170,
          y: 170 + Math.floor(nodes.length / 3) * 125,
        },
        data: {
          label: cleanName,
          nodeColor,
          nodeShape,
        },
      };

      setNodes((currentNodes) => [...currentNodes, newNode]);
    }

    if (modalMode === "edit" && editingNodeId) {
      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === editingNodeId
            ? {
                ...node,
                data: { ...node.data, label: cleanName, nodeColor, nodeShape },
              }
            : node,
        ),
      );
    }

    closeNodeModal();
  };

  // --------------------------------------------------------------
  // 11.7.1) إنشاء عدة عقد فرعية دفعة واحدة (Bulk Nodes)
  // --------------------------------------------------------------
  // 1. نأخذ العقدة التي اختارها المستخدم لتكون العقدة الرئيسية.
  // 2. نقسم النص إلى عناصر؛ كل سطر أو عنصر مفصول بفاصلة يصبح عقدة.
  // 3. نوزع العقد الجديدة أسفل العقدة الرئيسية على صفوف مرتبة.
  // 4. ننشئ رابطاً تلقائياً من العقدة الرئيسية إلى كل عقدة جديدة.
  // 5. نضيف العقد والروابط إلى React Flow، ثم يحفظها useEffect تلقائياً.
  // --------------------------------------------------------------
  const createBulkNodes = (event) => {
    event.preventDefault();

    const parentNode = nodes.find((node) => node.id === selectedParentId);
    const names = parseBulkNodeNames(bulkNodeText);

    // يجب وجود عقدة رئيسية وعنصر واحد على الأقل لإنشاء الفروع.
    if (!parentNode || names.length === 0) return;

    const MAX_NODES_PER_ROW = 5;
    const HORIZONTAL_GAP = 190;
    const VERTICAL_GAP = 155;
    const FIRST_ROW_DISTANCE = 190;

    // نجهز العقد الجديدة والروابط في عمليتين منفصلتين.
    const newNodes = names.map((name, index) => {
      const row = Math.floor(index / MAX_NODES_PER_ROW);
      const indexInRow = index % MAX_NODES_PER_ROW;
      const itemsInThisRow = Math.min(
        MAX_NODES_PER_ROW,
        names.length - row * MAX_NODES_PER_ROW,
      );

      // نضع كل صف في المنتصف أسفل العقدة الرئيسية.
      const centeredColumn = indexInRow - (itemsInThisRow - 1) / 2;

      return {
        id: uid(),
        type: "orbita",
        position: {
          x: parentNode.position.x + centeredColumn * HORIZONTAL_GAP,
          y: parentNode.position.y + FIRST_ROW_DISTANCE + row * VERTICAL_GAP,
        },
        data: {
          label: name,
          nodeColor: "gold",
          nodeShape: "rounded",
        },
      };
    });

    // نربط كل عقدة جديدة بالعقدة الرئيسية التي اختارها المستخدم.
    const newEdges = newNodes.map((node) => ({
      id: `edge-${parentNode.id}-${node.id}`,
      source: parentNode.id,
      target: node.id,
      type: "default",
      animated: false,
      style: { stroke: "#b49a5c", strokeWidth: 2 },
    }));

    // إضافة جميع العقد والروابط مرة واحدة بدلاً من إضافتها بشكل منفصل.
    setNodes((currentNodes) => [...currentNodes, ...newNodes]);
    setEdges((currentEdges) => [...currentEdges, ...newEdges]);

    // نُبقي تحديد العقدة الرئيسية حتى يستطيع المستخدم إضافة مجموعة أخرى تحتها.
    setSelectedParentId(parentNode.id);
    closeNodeModal();
  };

  // --------------------------------------------------------------
  // 11.8) حذف عقدة وروابطها
  // --------------------------------------------------------------
  // عند حذف عقدة، يجب حذف كل الخطوط التي:
  // - تبدأ من العقدة المحذوفة (source).
  // - أو تنتهي عند العقدة المحذوفة (target).
  // بهذا لا تبقى خطوط معلقة تشير إلى عقدة لم تعد موجودة.
  const deleteNode = (nodeId) => {
    setNodes((currentNodes) =>
      currentNodes.filter((node) => node.id !== nodeId),
    );

    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId,
      ),
    );

    // إذا حذف المستخدم العقدة الرئيسية المحددة، نلغي التحديد.
    if (selectedParentId === nodeId) setSelectedParentId(null);
  };

  // --------------------------------------------------------------
  // 11.9) تمرير أدوات التعديل والحذف إلى كل عقدة مخصصة
  // --------------------------------------------------------------
  // لا نحفظ الدوال داخل LocalStorage؛ فهي تُمرر للعقد وقت العرض فقط.
  // عند الضغط على زر القلم أو الحذف داخل العقدة، تستدعي العقدة هذه الدوال.
  // ترتيب الخريطة ثم ضبط مستوى العرض ليظهر المخطط كاملاً في مساحة العمل.
  // Export a clean, scalable SVG snapshot of the currently visible map.
  const handleExportMap = () => {
    // Export the complete visible map scaled down to a landscape print page.
    const exportNodes = visibleNodes;
    if (!exportNodes.length) return;

    const numeric = (value, fallback) => {
      const n = typeof value === "number" ? value : parseFloat(value);
      return Number.isFinite(n) && n > 0 ? n : fallback;
    };
    const getSize = (node) => ({
      w: numeric(
        node.measured?.width,
        numeric(node.width, numeric(node.style?.width, 150)),
      ),
      h: numeric(
        node.measured?.height,
        numeric(node.height, numeric(node.style?.height, 48)),
      ),
    });
    const xmlEscape = (value) =>
      String(value ?? "").replace(
        /[&<>"']/g,
        (ch) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&apos;",
          })[ch],
      );

    const padding = 36;
    const bounds = exportNodes.map((node) => {
      const { w, h } = getSize(node);
      return { x: node.position.x, y: node.position.y, w, h };
    });
    const minX = Math.min(...bounds.map((b) => b.x)) - padding;
    const minY = Math.min(...bounds.map((b) => b.y)) - padding;
    const maxX = Math.max(...bounds.map((b) => b.x + b.w)) + padding;
    const maxY = Math.max(...bounds.map((b) => b.y + b.h)) + padding;
    const contentW = Math.max(1, maxX - minX);
    const contentH = Math.max(1, maxY - minY);

    // Fixed landscape page canvas; the entire map is uniformly scaled to fit.
    const pageW = 1122; // A4 landscape at screen-like SVG units
    const pageH = 793;
    const pagePadding = 34;
    const scale = Math.min(
      (pageW - pagePadding * 2) / contentW,
      (pageH - pagePadding * 2) / contentH,
    );
    const offsetX = (pageW - contentW * scale) / 2;
    const offsetY = (pageH - contentH * scale) / 2;
    const nodeById = new Map(exportNodes.map((node) => [node.id, node]));

    const paths = visibleEdges
      .map((edge) => {
        const source = nodeById.get(edge.source),
          target = nodeById.get(edge.target);
        if (!source || !target) return "";
        const sw = getSize(source),
          tw = getSize(target);
        const sourceCenterX = source.position.x + sw.w / 2;
        const targetCenterX = target.position.x + tw.w / 2;
        const forward = targetCenterX >= sourceCenterX;
        const sx = source.position.x + (forward ? sw.w : 0);
        const sy = source.position.y + sw.h / 2;
        const tx = target.position.x + (forward ? 0 : tw.w);
        const ty = target.position.y + tw.h / 2;
        const dx = tx - sx;
        const bend = Math.max(30, Math.min(160, Math.abs(dx) * 0.42));
        const c1x = sx + (forward ? bend : -bend);
        const c2x = tx - (forward ? bend : -bend);
        return `<path d="M ${(sx - minX) * scale + offsetX} ${(sy - minY) * scale + offsetY} C ${(c1x - minX) * scale + offsetX} ${(sy - minY) * scale + offsetY}, ${(c2x - minX) * scale + offsetX} ${(ty - minY) * scale + offsetY}, ${(tx - minX) * scale + offsetX} ${(ty - minY) * scale + offsetY}" fill="none" stroke="#b49a5c" stroke-width="${Math.max(0.8, 2 * scale)}" stroke-linecap="round"/>`;
      })
      .join("");

    const cards = exportNodes
      .map((node) => {
        const { w, h } = getSize(node);
        const x = (node.position.x - minX) * scale + offsetX;
        const y = (node.position.y - minY) * scale + offsetY;
        const nw = w * scale,
          nh = h * scale;
        const fontSize = Math.max(7, Math.min(15, 15 * scale));
        const label = xmlEscape(node.data?.label);
        return `<g><rect x="${x}" y="${y}" width="${nw}" height="${nh}" rx="${Math.max(3, 12 * scale)}" fill="#fffdf8" stroke="#d9c89b" stroke-width="${Math.max(0.6, 1.5 * scale)}"/><text x="${x + nw / 2}" y="${y + nh / 2 + fontSize * 0.34}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" fill="#332f27">${label}</text></g>`;
      })
      .join("");

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="210mm" viewBox="0 0 ${pageW} ${pageH}" preserveAspectRatio="xMidYMid meet"><rect width="${pageW}" height="${pageH}" fill="#ffffff"/>${paths}${cards}</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(map.name || "orbita-map").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const handleAutoArrange = () => {
    const arranged = autoArrangeMapNodes(nodes, edges);
    const arrangedById = new Map(arranged.map((node) => [node.id, node]));
    setNodes(arranged);
    fitMapToView(320, arranged);
    setEdges((currentEdges) =>
      currentEdges.map((edge) => {
        const source = arrangedById.get(edge.source);
        const target = arrangedById.get(edge.target);
        if (!source || !target) return edge;
        const direction =
          target.position.x < source.position.x ? "left" : "right";
        return {
          ...edge,
          type: "default",
          sourceHandle: `source-${direction}`,
          targetHandle: `target-${direction === "left" ? "right" : "left"}`,
        };
      }),
    );
    fitMapToView(420, arranged);
  };

  // حالة العقد المطوية محفوظة داخل بيانات العقد نفسها لتبقى بعد إعادة فتح الخريطة.
  // حساب الأحفاد يسمح بإخفاء فرع كامل دون حذف أي عقدة أو رابط.
  const getDescendantIds = (rootId) => {
    const found = new Set();
    const stack = [rootId];
    while (stack.length) {
      const current = stack.pop();
      edges.forEach((edge) => {
        if (edge.source === current && !found.has(edge.target)) {
          found.add(edge.target);
          stack.push(edge.target);
        }
      });
    }
    return found;
  };

  const toggleNodeCollapse = (nodeId) => {
    const node = nodes.find((item) => item.id === nodeId);
    const nextCollapsed = !node?.data?.isCollapsed;
    setCollapsedNodeIds((previous) => {
      const next = new Set(previous);
      if (nextCollapsed) next.add(nodeId);
      else next.delete(nodeId);
      return next;
    });
    setNodes((currentNodes) =>
      currentNodes.map((item) =>
        item.id === nodeId
          ? { ...item, data: { ...item.data, isCollapsed: nextCollapsed } }
          : item,
      ),
    );
  };

  const hiddenNodeIds = new Set();
  collapsedNodeIds.forEach((collapsedId) => {
    getDescendantIds(collapsedId).forEach((descendantId) =>
      hiddenNodeIds.add(descendantId),
    );
  });
  const visibleNodes = nodes.filter((node) => !hiddenNodeIds.has(node.id));
  const visibleEdges = edges.filter(
    (edge) =>
      !hiddenNodeIds.has(edge.source) && !hiddenNodeIds.has(edge.target),
  );

  // Keep viewport movement close to the visible map. Hidden branches do not
  // enlarge the pan area, and the padding is deliberately modest.
  const mapExtent = (() => {
    const extentNodes = visibleNodes.length ? visibleNodes : nodes;
    const dimension = (value, fallback) => {
      const parsed =
        typeof value === "number" ? value : Number.parseFloat(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    };
    if (!extentNodes.length)
      return [
        [-500, -350],
        [500, 350],
      ];

    const bounds = extentNodes.map((node) => ({
      minX: node.position.x,
      minY: node.position.y,
      maxX:
        node.position.x +
        dimension(node.measured?.width ?? node.width ?? node.style?.width, 170),
      maxY:
        node.position.y +
        dimension(
          node.measured?.height ?? node.height ?? node.style?.height,
          58,
        ),
    }));
    const panPaddingX = 900;
    const panPaddingY = 700;
    return [
      [
        Math.min(...bounds.map((item) => item.minX)) - panPaddingX,
        Math.min(...bounds.map((item) => item.minY)) - panPaddingY,
      ],
      [
        Math.max(...bounds.map((item) => item.maxX)) + panPaddingX,
        Math.max(...bounds.map((item) => item.maxY)) + panPaddingY,
      ],
    ];
  })();

  // Keep the user's zoom steady while nodes are added or hidden. Fit is explicit.

  const nodesWithActions = visibleNodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      hasChildren: edges.some((edge) => edge.source === node.id),
      isCollapsed: collapsedNodeIds.has(node.id),
      hiddenCount: getDescendantIds(node.id).size,
      onToggleCollapse: toggleNodeCollapse,
      collapseLabel: t.collapseBranch,
      expandLabel: t.expandBranch,
      onEdit: openEditNodeModal,
      onDelete: deleteNode,
      editLabel: t.editNode,
      deleteLabel: t.deleteNode,
      isSelectedParent: node.id === selectedParentId,
    },
  }));

  // --------------------------------------------------------------
  // 11.10) حذف الروابط التابعة للعقد المحذوفة من لوحة المفاتيح
  // --------------------------------------------------------------
  // React Flow يسمح بتحديد عقدة ثم الضغط على Delete أو Backspace.
  // هذا الحدث يتأكد من حذف الروابط المتصلة بالعقد التي تم حذفها أيضاً.
  const handleNodesDelete = (deletedNodes) => {
    const deletedIds = new Set(deletedNodes.map((node) => node.id));

    // إذا كانت العقدة الرئيسية المحددة ضمن العقد المحذوفة، نلغي تحديدها.
    if (selectedParentId && deletedIds.has(selectedParentId)) {
      setSelectedParentId(null);
    }

    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target),
      ),
    );
  };

  // --------------------------------------------------------------
  // 11.11) حفظ أي تغيير في الخريطة داخل بيانات مدار
  // --------------------------------------------------------------
  // نحول عقد React Flow إلى صيغة التخزين الأصلية في مدار.
  // نحفظ اسم كل عقدة وموقعها، ونحفظ edges كما هي حتى تبقى التفرعات.
  // useEffect يعمل عند تغيير العقد أو الروابط، بما في ذلك السحب والربط.
  useEffect(() => {
    const savedNodes = nodes.map((node) => ({
      id: node.id,
      text: node.data.label,
      x: node.position.x,
      y: node.position.y,
      isCollapsed: node.data.isCollapsed || false,
      nodeColor: node.data.nodeColor || "gold",
      nodeShape: node.data.nodeShape || "rounded",
    }));

    onUpdate({
      ...map,
      nodes: savedNodes,
      edges,
    });
    // لا نضيف onUpdate إلى dependencies لأنه callback جديد من المكوّن الأب
    // في كل render، وإضافته قد تسبب تكرار تحديثات غير ضروري.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  // --------------------------------------------------------------
  // 11.12) واجهة محرر الخريطة
  // --------------------------------------------------------------
  return (
    <section className="map-editor-section">
      {/* عنوان الخريطة وأزرار التحكم الرئيسية */}
      <div className="page-heading">
        <div>
          <button className="back-btn" onClick={onBack}>
            ← {t.back}
          </button>
          <h1>{map.name}</h1>
          <p>{t.mapInstructions}</p>
        </div>

        <div className="heading-actions">
          {/* تنزيل الخريطة بصيغة SVG قابلة للتكبير والطباعة */}
          <button className="secondary-btn" onClick={handleExportMap}>
            <Download size={16} />
            {rtl ? "تحميل الخريطة" : "Export Map"}
          </button>
          {/* إعادة عرض كل العقد المرئية داخل مساحة الخريطة */}
          <button
            className="secondary-btn"
            onClick={() => fitMapToView(320, visibleNodes)}
            title={rtl ? "إظهار جميع العقد المرئية" : "Fit all visible nodes"}
          >
            <Maximize2 size={16} />
            {t.fitMap}
          </button>
          {/* ترتيب العقد تلقائياً حسب الفروع والمستويات */}
          <button className="secondary-btn" onClick={handleAutoArrange}>
            <Layers size={16} />
            {rtl ? "ترتيب تلقائي" : "Auto Arrange"}
          </button>
          {/* فتح نافذة إضافة عقدة واحدة غير مرتبطة تلقائياً */}
          <button className="primary-btn" onClick={openAddNodeModal}>
            <Plus size={16} />
            {t.newNode}
          </button>

          {/* إضافة عدة عقد فرعية مرتبطة بالعقدة الرئيسية المحددة */}
          <button
            className="secondary-btn"
            onClick={openBulkNodesModal}
            disabled={!selectedParentId}
            title={!selectedParentId ? t.selectParentHint : t.bulkNodes}
            style={
              !selectedParentId
                ? { opacity: 0.45, cursor: "not-allowed" }
                : undefined
            }
          >
            <Layers size={16} />
            {t.bulkNodes}
          </button>

          {/* حذف الخريطة كاملة من قائمة الخرائط */}
          <button className="danger-btn" onClick={onDelete}>
            <Trash2 size={16} />
            {t.delete}
          </button>
        </div>
      </div>

      {/* تعليمات اختيار العقدة الرئيسية لإضافة فروع جديدة تحتها */}
      <div
        className="map-parent-hint"
        style={{
          margin: "0 0 12px",
          padding: "10px 13px",
          border: "1px solid var(--border)",
          borderRadius: "9px",
          background: "var(--surface)",
          color: "var(--muted)",
          fontSize: "12px",
        }}
      >
        {selectedParentNode ? (
          <span>
            {t.selectedParent}: <strong>{selectedParentNode.data.label}</strong>
          </span>
        ) : (
          <span>{t.selectParentHint}</span>
        )}
      </div>

      {/* مساحة React Flow: العقد، الروابط، التكبير والتصغير */}
      <div
        className="real-map-canvas"
        style={{
          height: "min(62vh, 560px)",
          minHeight: "360px",
          maxHeight: "560px",
          width: "100%",
          overflow: "hidden",
          borderRadius: "14px",
        }}
      >
        <ReactFlow
          nodes={nodesWithActions}
          edges={visibleEdges}
          nodeTypes={nodeTypes}
          onInit={(instance) => {
            reactFlowInstanceRef.current = instance;
            fitMapToView(0, visibleNodes);
          }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(connection) =>
            setEdges((currentEdges) =>
              addEdge(
                {
                  ...connection,
                  type: "default",
                  animated: false,
                  style: { stroke: "#b49a5c", strokeWidth: 2 },
                },
                currentEdges,
              ),
            )
          }
          onNodesDelete={handleNodesDelete}
          onNodeClick={(_event, node) => setSelectedParentId(node.id)}
          onPaneClick={() => setSelectedParentId(null)}
          onNodeDoubleClick={(_event, node) => openEditNodeModal(node.id)}
          deleteKeyCode={["Backspace", "Delete"]}
          minZoom={0.2}
          maxZoom={1.35}
          translateExtent={mapExtent}
          zoomOnScroll={false}
          zoomOnPinch
          zoomOnDoubleClick={false}
          connectionLineStyle={{ stroke: "#b49a5c", strokeWidth: 2 }}
          defaultEdgeOptions={{
            type: "default",
            style: { stroke: "#b49a5c", strokeWidth: 2 },
          }}
        >
          {/* خلفية النقاط التي تساعد على ترتيب العقد */}
          <Background color="#8f8a7d" gap={22} size={1} />

          {/* أزرار التكبير والتصغير وإعادة العرض */}
          <Controls />

          {/* خريطة مصغرة تساعد على رؤية مساحة العمل كاملة */}
          <MiniMap nodeColor="#c7b078" maskColor="rgba(0,0,0,0.12)" />
        </ReactFlow>
      </div>

      {/* ----------------------------------------------------------
          نافذة إضافة عقدة أو تعديل اسم عقدة
          هذه النافذة جزء من واجهة مدار وليست نافذة من المتصفح.
         ---------------------------------------------------------- */}
      {modalMode && (
        <div
          className="orbita-modal-overlay"
          onMouseDown={(event) => {
            // إغلاق النافذة عند الضغط على الخلفية الداكنة فقط.
            if (event.target === event.currentTarget) closeNodeModal();
          }}
        >
          {modalMode === "bulk" ? (
            // ------------------------------------------------------
            // نافذة الإضافة الجماعية: كل عنصر يصبح عقدة فرعية مستقلة.
            // ------------------------------------------------------
            <form
              className="orbita-modal orbita-bulk-modal"
              onSubmit={createBulkNodes}
            >
              <h3>{t.bulkTitle}</h3>
              <p>{t.bulkDescription}</p>

              {/* نوضح للمستخدم العقدة الرئيسية التي سترتبط بها العناصر */}
              <div
                className="bulk-parent-summary"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 13px",
                  marginBottom: "16px",
                  borderRadius: "9px",
                  background: "var(--primary-soft)",
                  color: "var(--text)",
                  fontSize: "12px",
                }}
              >
                <span style={{ color: "var(--muted)" }}>
                  {t.selectedParent}
                </span>
                <strong>{selectedParentNode?.data.label || "—"}</strong>
              </div>

              {/* مربع النص يقبل اللصق أو الكتابة، سطراً بسطر أو بفواصل */}
              <label htmlFor="orbita-bulk-node-names">{t.bulkNodes}</label>
              <textarea
                id="orbita-bulk-node-names"
                autoFocus
                dir={rtl ? "rtl" : "ltr"}
                value={bulkNodeText}
                onChange={(event) => setBulkNodeText(event.target.value)}
                placeholder={t.bulkPlaceholder}
                rows={8}
                style={{
                  display: "block",
                  width: "100%",
                  minHeight: "170px",
                  resize: "vertical",
                  padding: "12px",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  background: "var(--surface2)",
                  color: "var(--text)",
                  font: "inherit",
                  fontSize: "13px",
                  lineHeight: 1.8,
                  outline: "none",
                }}
              />

              {/* عداد مباشر لعدد العقد التي سيتم إنشاؤها */}
              <div
                className="bulk-count"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  marginTop: "10px",
                  color: "var(--muted)",
                  fontSize: "11px",
                }}
              >
                <strong style={{ color: "var(--text)", fontSize: "14px" }}>
                  {bulkNodeNames.length}
                </strong>
                <span>{t.bulkCount}</span>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeNodeModal}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={bulkNodeNames.length === 0 || !selectedParentNode}
                >
                  <Plus size={16} />
                  {t.bulkCreate}
                </button>
              </div>
            </form>
          ) : (
            // ------------------------------------------------------
            // نافذة إضافة عقدة واحدة أو تعديل اسم عقدة موجودة.
            // ------------------------------------------------------
            <form className="orbita-modal" onSubmit={saveNode}>
              <h3>{modalMode === "add" ? t.addNodeTitle : t.editNodeTitle}</h3>

              <p>{t.nodeDialogDescription}</p>

              <label htmlFor="orbita-node-name">{t.nodePlaceholder}</label>
              <input
                id="orbita-node-name"
                autoFocus
                dir={rtl ? "rtl" : "ltr"}
                value={nodeName}
                onChange={(event) => setNodeName(event.target.value)}
                placeholder={t.nodeNamePlaceholder}
                maxLength={80}
              />

              {/* اختيار لون العقدة */}
              <label style={{ display: "block", marginTop: "14px" }}>
                {rtl ? "لون العقدة" : "Node color"}
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "9px",
                  margin: "8px 0 14px",
                }}
              >
                {Object.entries(nodeColorOptions).map(([key, color]) => (
                  <button
                    key={key}
                    type="button"
                    className="nodrag nopan"
                    onClick={() => setNodeColor(key)}
                    title={key}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: color.bg,
                      border:
                        nodeColor === key
                          ? `3px solid ${color.border}`
                          : `1px solid ${color.border}`,
                      boxShadow:
                        nodeColor === key ? "0 0 0 2px var(--surface)" : "none",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>

              {/* اختيار شكل العقدة */}
              <label htmlFor="orbita-node-shape">
                {rtl ? "شكل العقدة" : "Node shape"}
              </label>
              <select
                id="orbita-node-shape"
                value={nodeShape}
                onChange={(event) => setNodeShape(event.target.value)}
                style={{
                  width: "100%",
                  marginTop: "7px",
                  padding: "10px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  background: "var(--surface2)",
                  color: "var(--text)",
                  font: "inherit",
                }}
              >
                <option value="rounded">{rtl ? "مستديرة" : "Rounded"}</option>
                <option value="square">{rtl ? "مربعة" : "Square"}</option>
                <option value="pill">{rtl ? "كبسولة" : "Pill"}</option>
                <option value="hex">{rtl ? "سداسية" : "Hexagon"}</option>
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeNodeModal}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={!nodeName.trim()}
                >
                  {modalMode === "add" ? t.add : t.updateNode}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
}

// ================================================================
// 19) TOPIC EDITOR — إدارة الدروس داخل موضوع التعلم
// ================================================================
// يمكن إضافة درس، تعديل محتواه، أو حذفه من الموضوع.
function TopicEditor({
  topic,
  t,
  rtl,
  openDialog,
  onBack,
  onUpdate,
  onDelete,
}) {
  const addLesson = () =>
    openDialog({
      title: t.lesson,
      fields: [
        {
          name: "name",
          label: t.lessonName,
          placeholder: rtl ? "اكتب عنوان الدرس..." : "Enter lesson title...",
          required: true,
        },
      ],
      submitLabel: t.add,
      onSubmit: ({ name }) => {
        if (!name?.trim()) return;
        onUpdate({
          ...topic,
          lessons: [
            ...topic.lessons,
            { id: uid(), name: name.trim(), content: "" },
          ],
        });
      },
    });
  const editLesson = (lesson) =>
    openDialog({
      title: lesson.name,
      description: rtl
        ? "أضف شرح الدرس أو عدّل المحتوى."
        : "Add or edit the lesson content.",
      fields: [
        {
          name: "content",
          label: t.description,
          type: "textarea",
          defaultValue: lesson.content || "",
        },
      ],
      submitLabel: t.save,
      onSubmit: ({ content }) =>
        onUpdate({
          ...topic,
          lessons: topic.lessons.map((l) =>
            l.id === lesson.id ? { ...l, content } : l,
          ),
        }),
    });
  return (
    <section>
      <div className="page-heading">
        <div>
          <button className="back-btn" onClick={onBack}>
            ← {t.back}
          </button>
          <h1>{topic.name}</h1>
        </div>
        <div className="heading-actions">
          <button className="primary-btn" onClick={addLesson}>
            <Plus size={16} />
            {t.lesson}
          </button>
          <button className="danger-btn" onClick={onDelete}>
            <Trash2 size={16} />
            {t.delete}
          </button>
        </div>
      </div>
      <div className="cards-grid">
        {topic.lessons.map((lesson) => (
          <div
            className="lesson-card"
            key={lesson.id}
            onClick={() => editLesson(lesson)}
          >
            <div className="lesson-icon">
              <FileText size={22} />
            </div>
            <h3>{lesson.name}</h3>
            <p>{lesson.content || t.noDescription}</p>
            <div className="lesson-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate({
                    ...topic,
                    lessons: topic.lessons.filter((l) => l.id !== lesson.id),
                  });
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {topic.lessons.length === 0 && (
          <Empty icon={BookOpen} title={t.noTasks} text={t.lesson} />
        )}
      </div>
    </section>
  );
}

// ================================================================
// 20) PROJECT EDITOR — لوحة Kanban الخاصة بكل مشروع
// ================================================================
// الأعمدة الثلاثة: قيد الانتظار، قيد التنفيذ، مكتمل.
// يمكن إضافة المهام وحذفها وسحبها من عمود إلى آخر.
function ProjectEditor({
  project,
  t,
  rtl,
  openDialog,
  onBack,
  onUpdate,
  onDelete,
}) {
  const columns = ["todo", "doing", "done"];
  const addTask = (status) =>
    openDialog({
      title: t.task,
      fields: [
        {
          name: "title",
          label: t.task,
          placeholder: t.taskPlaceholder,
          required: true,
        },
      ],
      submitLabel: t.add,
      onSubmit: ({ title }) => {
        if (!title?.trim()) return;
        onUpdate({
          ...project,
          tasks: [...project.tasks, { id: uid(), title: title.trim(), status }],
        });
      },
    });
  const moveTask = (taskId, status) =>
    onUpdate({
      ...project,
      tasks: project.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    });
  return (
    <section>
      <div className="page-heading">
        <div>
          <button className="back-btn" onClick={onBack}>
            ← {t.back}
          </button>
          <h1>{project.name}</h1>
          <p>{t.move}</p>
        </div>
        <button className="danger-btn" onClick={onDelete}>
          <Trash2 size={16} />
          {t.delete}
        </button>
      </div>
      <div className="kanban">
        {columns.map((col) => (
          <div
            className="kanban-column"
            key={col}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("taskId");
              if (id) moveTask(id, col);
            }}
          >
            <div className="column-heading">
              <h3>{t[col]}</h3>
              <span>
                {project.tasks.filter((task) => task.status === col).length}
              </span>
              <button onClick={() => addTask(col)}>
                <Plus size={17} />
              </button>
            </div>
            {project.tasks
              .filter((task) => task.status === col)
              .map((task) => (
                <div
                  className="task-card"
                  draggable
                  key={task.id}
                  onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
                >
                  <Circle size={16} />
                  <span>{task.title}</span>
                  <button
                    onClick={() =>
                      onUpdate({
                        ...project,
                        tasks: project.tasks.filter((t) => t.id !== task.id),
                      })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            {project.tasks.filter((task) => task.status === col).length ===
              0 && <div className="column-empty">{t.noTasks}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
