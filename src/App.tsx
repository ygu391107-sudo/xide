import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  Layers3,
  Library,
  Map,
  PenLine,
  Sparkles,
  Target,
} from "lucide-react";

type View = "home" | "map" | "library" | "field" | "session";
type SessionStep = "read" | "recall" | "feedback" | "schedule" | "apply";

type AbilityModule = {
  id: string;
  name: string;
  problem: string;
  progress: number;
  concepts: string[];
  books: string[];
  islands: {
    name: string;
    points: number;
    books: number;
  }[];
};

type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  excerpt: string;
  contributes: string[];
};

type KnowledgePoint = {
  id: string;
  title: string;
  source: string;
  ability: string;
  mastery: number;
  due: string;
};

type ApplicationTask = {
  id: string;
  title: string;
  scenario: string;
  points: string[];
  completed: boolean;
};

const abilities: AbilityModule[] = [
  {
    id: "learning",
    name: "高效学习",
    problem: "把输入转化成稳定能力，而不是短暂熟悉感。",
    progress: 72,
    concepts: ["主动回忆", "间隔复习", "反馈修正"],
    books: ["上瘾式学习", "认知天性"],
    islands: [
      { name: "记忆机制", points: 12, books: 3 },
      { name: "主动回忆", points: 9, books: 2 },
      { name: "间隔复习", points: 8, books: 2 },
      { name: "反馈修正", points: 6, books: 2 },
      { name: "应用输出", points: 11, books: 4 },
      { name: "学习环境", points: 5, books: 1 },
    ],
  },
  {
    id: "decision",
    name: "决策判断",
    problem: "在复杂选择里看见成本、概率和长期影响。",
    progress: 54,
    concepts: ["机会成本", "二阶后果", "概率思维"],
    books: ["思考，快与慢", "穷查理宝典"],
    islands: [
      { name: "机会成本", points: 7, books: 2 },
      { name: "偏误识别", points: 10, books: 3 },
      { name: "长期后果", points: 6, books: 2 },
    ],
  },
  {
    id: "writing",
    name: "表达写作",
    problem: "用短句讲清观点，让别人立刻知道下一步。",
    progress: 41,
    concepts: ["结构表达", "删减噪音", "例子驱动"],
    books: ["金字塔原理", "风格感觉"],
    islands: [
      { name: "观点排序", points: 6, books: 2 },
      { name: "短句表达", points: 5, books: 1 },
      { name: "例子设计", points: 4, books: 2 },
    ],
  },
  {
    id: "longterm",
    name: "长期主义",
    problem: "把今天的小动作放进更长的复利系统。",
    progress: 36,
    concepts: ["复利", "耐心", "系统习惯"],
    books: ["纳瓦尔宝典", "原则"],
    islands: [
      { name: "复利系统", points: 5, books: 2 },
      { name: "反脆弱", points: 3, books: 1 },
      { name: "节奏管理", points: 4, books: 2 },
    ],
  },
];

const books: Book[] = [
  {
    id: "habit-learning",
    title: "上瘾式学习",
    author: "李明",
    cover: "from-blue-100 to-sky-200",
    excerpt:
      "真正有效的学习不是重复阅读，而是在遗忘发生前主动取回。每一次困难回忆，都会让知识的提取路径更稳固。",
    contributes: ["高效学习", "记忆管理", "自我训练"],
  },
  {
    id: "make-it-stick",
    title: "认知天性",
    author: "彼得 C. 布朗",
    cover: "from-indigo-100 to-blue-200",
    excerpt:
      "测验不是学习后的检查，而是学习本身。低风险测验会暴露空白，也会加深长期记忆。",
    contributes: ["高效学习", "反馈修正", "长期记忆"],
  },
  {
    id: "thinking",
    title: "思考，快与慢",
    author: "丹尼尔·卡尼曼",
    cover: "from-slate-100 to-gray-200",
    excerpt: "直觉很快，但它也会在复杂问题里给出过度自信的答案。",
    contributes: ["决策判断", "偏误识别", "概率思维"],
  },
  {
    id: "pyramid",
    title: "金字塔原理",
    author: "芭芭拉·明托",
    cover: "from-cyan-100 to-blue-100",
    excerpt: "清楚的表达先给结论，再组织理由，让听者减少整理负担。",
    contributes: ["表达写作", "结构表达", "沟通效率"],
  },
];

const knowledgePoints: KnowledgePoint[] = [
  {
    id: "active-recall",
    title: "主动回忆比重复阅读更有效",
    source: "认知天性",
    ability: "高效学习",
    mastery: 62,
    due: "今天",
  },
  {
    id: "blank-paper",
    title: "白纸法能暴露理解空洞",
    source: "上瘾式学习",
    ability: "高效学习",
    mastery: 48,
    due: "今天",
  },
  {
    id: "feedback",
    title: "反馈要指出遗漏和误解",
    source: "上瘾式学习",
    ability: "高效学习",
    mastery: 56,
    due: "今天",
  },
  {
    id: "opportunity-cost",
    title: "机会成本是被放弃的最好选项",
    source: "思考，快与慢",
    ability: "决策判断",
    mastery: 44,
    due: "今天",
  },
  {
    id: "conclusion-first",
    title: "先说结论能降低理解负担",
    source: "金字塔原理",
    ability: "表达写作",
    mastery: 58,
    due: "今天",
  },
];

const initialTasks: ApplicationTask[] = [
  {
    id: "explain-recall",
    title: "用 100 字解释主动回忆",
    scenario: "发给一个正在备考的朋友。",
    points: ["主动回忆", "反馈修正"],
    completed: false,
  },
  {
    id: "cost-choice",
    title: "用机会成本分析今天一个选择",
    scenario: "在工作、学习或消费中选一个真实决定。",
    points: ["机会成本"],
    completed: false,
  },
  {
    id: "blank-paper-article",
    title: "用白纸法学习一篇文章",
    scenario: "读完后合上页面，写下你真正记住的结构。",
    points: ["白纸法", "主动回忆"],
    completed: false,
  },
];

const navItems = [
  { id: "home", label: "首页", subtitle: "今天练什么", icon: Target },
  { id: "map", label: "能力地图", subtitle: "我正在形成什么能力", icon: Map },
  { id: "library", label: "书库", subtitle: "能力来自哪些书", icon: Library },
  { id: "field", label: "应用场", subtitle: "我把知识用到哪里", icon: Compass },
] as const;

const sessionSteps: { id: SessionStep; label: string }[] = [
  { id: "read", label: "学习中" },
  { id: "recall", label: "白纸回忆" },
  { id: "feedback", label: "AI 反馈" },
  { id: "schedule", label: "复习安排" },
  { id: "apply", label: "应用任务" },
];

function App() {
  const [view, setView] = useState<View>("home");
  const [selectedAbility, setSelectedAbility] = useState("learning");
  const [selectedBook, setSelectedBook] = useState(books[0]);
  const [sessionStep, setSessionStep] = useState<SessionStep>("read");
  const [recallText, setRecallText] = useState("");
  const [tasks, setTasks] = useState(initialTasks);

  const activeAbility = useMemo(
    () => abilities.find((ability) => ability.id === selectedAbility) ?? abilities[0],
    [selectedAbility],
  );

  const todayTask = tasks.find((task) => !task.completed) ?? tasks[0];

  const startSession = (book = books[0]) => {
    setSelectedBook(book);
    setSessionStep("read");
    setRecallText("");
    setView("session");
  };

  const completeTask = (taskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-gradient-to-b from-blue-100/70 via-white/60 to-transparent" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <Header onStartSession={() => startSession()} view={view} setView={setView} />

        <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[260px_1fr]">
          <Sidebar view={view} setView={setView} />
          <section className="min-w-0">
            {view === "home" && (
              <HomeView
                todayTask={todayTask}
                tasks={tasks}
                onStartSession={() => startSession()}
                onCompleteTask={completeTask}
                onNavigate={setView}
              />
            )}
            {view === "map" && (
              <AbilityMapView
                activeAbility={activeAbility}
                selectedAbility={selectedAbility}
                setSelectedAbility={setSelectedAbility}
              />
            )}
            {view === "library" && (
              <LibraryView onStartSession={startSession} />
            )}
            {view === "field" && (
              <FieldView tasks={tasks} onCompleteTask={completeTask} />
            )}
            {view === "session" && (
              <SessionView
                book={selectedBook}
                recallText={recallText}
                sessionStep={sessionStep}
                setRecallText={setRecallText}
                setSessionStep={setSessionStep}
                onFinish={() => setView("field")}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

type NavigationProps = {
  view: View;
  setView: (view: View) => void;
};

function Header({
  onStartSession,
  view,
  setView,
}: NavigationProps & { onStartSession: () => void }) {
  return (
    <header className="flex items-center justify-between rounded-3xl bg-white/80 px-5 py-4 shadow-sm shadow-slate-200/80 backdrop-blur">
      <button
        className="flex items-center gap-3 text-left"
        onClick={() => setView("home")}
        type="button"
      >
        <span className="grid size-11 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
          <Sparkles size={20} />
        </span>
        <span>
          <span className="block text-lg font-semibold">习得</span>
          <span className="block text-sm text-slate-500">
            把书变成能力的 AI 学习教练
          </span>
        </span>
      </button>
      <button
        className="hidden items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 sm:flex"
        onClick={() => {
          if (view === "session") {
            setView("home");
            return;
          }

          onStartSession();
        }}
        type="button"
      >
        {view === "session" ? "回到首页" : "开始一次训练"}
        <ArrowRight size={16} />
      </button>
    </header>
  );
}

function Sidebar({ view, setView }: NavigationProps) {
  return (
    <aside className="rounded-3xl bg-white/75 p-3 shadow-sm shadow-slate-200/80 backdrop-blur lg:sticky lg:top-6 lg:h-fit">
      <nav className="grid gap-2" aria-label="Primary">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;

          return (
            <button
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
              key={item.id}
              onClick={() => setView(item.id)}
              type="button"
            >
              <Icon size={19} />
              <span>
                <span className="block text-sm font-semibold">{item.label}</span>
                <span
                  className={`block text-xs ${
                    active ? "text-blue-100" : "text-slate-400"
                  }`}
                >
                  {item.subtitle}
                </span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

type HomeViewProps = {
  todayTask: ApplicationTask;
  tasks: ApplicationTask[];
  onStartSession: () => void;
  onCompleteTask: (taskId: string) => void;
  onNavigate: (view: View) => void;
};

function HomeView({
  todayTask,
  tasks,
  onStartSession,
  onCompleteTask,
  onNavigate,
}: HomeViewProps) {
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-white px-6 py-8 shadow-sm shadow-slate-200/90 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-blue-600">今天练什么</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            今天，把 3 个知识变成你的能力。
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-500">
            系统已经排好训练顺序。你只需要读一点、合上书、说出你记住了什么。
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            onClick={onStartSession}
            type="button"
          >
            开始 12 分钟训练
            <ArrowRight size={16} />
          </button>
          <button
            className="inline-flex items-center justify-center rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            onClick={() => onNavigate("map")}
            type="button"
          >
            查看能力地图
          </button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <Panel
          action="进入训练"
          icon={<PenLine size={18} />}
          onAction={onStartSession}
          title="今日提取"
        >
          <div className="grid gap-3">
            {knowledgePoints.slice(0, 5).map((point) => (
              <div
                className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3"
                key={point.id}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {point.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {point.ability} · {point.source}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-600 shadow-sm">
                  {point.due}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          action="看全部"
          icon={<Layers3 size={18} />}
          onAction={() => onNavigate("map")}
          title="能力进度"
        >
          <div className="space-y-5">
            {abilities.slice(0, 3).map((ability) => (
              <ProgressRow
                key={ability.id}
                label={ability.name}
                progress={ability.progress}
                subtext={ability.problem}
              />
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        action={todayTask.completed ? "已完成" : "标记完成"}
        icon={<Target size={18} />}
        onAction={() => onCompleteTask(todayTask.id)}
        title="今日应用"
      >
        <div className="flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-br from-blue-50 to-white p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xl font-semibold text-slate-950">{todayTask.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{todayTask.scenario}</p>
          </div>
          <div className="text-sm font-medium text-blue-600">
            已完成 {completedCount}/{tasks.length}
          </div>
        </div>
      </Panel>
    </div>
  );
}

type PanelProps = {
  title: string;
  icon: ReactNode;
  action?: string;
  onAction?: () => void;
  children: ReactNode;
};

function Panel({ title, icon, action, onAction, children }: PanelProps) {
  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm shadow-slate-200/90 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-blue-50 text-blue-600">
            {icon}
          </span>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {action && onAction ? (
          <button
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
            onClick={onAction}
            type="button"
          >
            {action}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function ProgressRow({
  label,
  progress,
  subtext,
}: {
  label: string;
  progress: number;
  subtext: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-1 line-clamp-1 text-xs text-slate-500">{subtext}</p>
        </div>
        <span className="text-sm font-semibold text-blue-600">{progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-blue-600"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

type AbilityMapProps = {
  activeAbility: AbilityModule;
  selectedAbility: string;
  setSelectedAbility: (id: string) => void;
};

function AbilityMapView({
  activeAbility,
  selectedAbility,
  setSelectedAbility,
}: AbilityMapProps) {
  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="能力地图"
        title="你正在形成的，不是笔记，是能力。"
        description="书和知识点被系统收进后台，前台只保留能力、训练和下一步。"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {abilities.map((ability) => {
          const active = selectedAbility === ability.id;

          return (
            <button
              className={`rounded-[1.5rem] p-5 text-left shadow-sm transition ${
                active
                  ? "bg-blue-600 text-white shadow-blue-200"
                  : "bg-white text-slate-950 shadow-slate-200/90 hover:-translate-y-0.5"
              }`}
              key={ability.id}
              onClick={() => setSelectedAbility(ability.id)}
              type="button"
            >
              <div className="mb-8 flex items-center justify-between">
                <span
                  className={`grid size-10 place-items-center rounded-2xl ${
                    active ? "bg-white/15" : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <Target size={18} />
                </span>
                <span className={active ? "text-blue-100" : "text-blue-600"}>
                  {ability.progress}%
                </span>
              </div>
              <h3 className="text-lg font-semibold">{ability.name}</h3>
              <p
                className={`mt-2 line-clamp-2 text-sm leading-6 ${
                  active ? "text-blue-50" : "text-slate-500"
                }`}
              >
                {ability.problem}
              </p>
            </button>
          );
        })}
      </div>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200/90">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-600">主题岛屿</p>
            <h2 className="mt-2 text-3xl font-semibold">{activeAbility.name}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              {activeAbility.problem}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            来源：{activeAbility.books.join("、")}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {activeAbility.islands.map((island) => (
            <article
              className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-5"
              key={island.name}
            >
              <div className="mb-7 flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <Layers3 size={18} />
                </span>
                <ChevronRight className="text-slate-300" size={18} />
              </div>
              <h3 className="text-lg font-semibold">{island.name}</h3>
              <p className="mt-2 text-sm text-slate-500">
                {island.points} 个知识点 · {island.books} 本书
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function LibraryView({ onStartSession }: { onStartSession: (book: Book) => void }) {
  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="书库"
        title="书不在前台堆积，它们在后台贡献能力。"
        description="这里不追踪页数。每本书都被转化为能力模块、复习任务和应用场景。"
      />

      <div className="grid gap-5 md:grid-cols-2">
        {books.map((book) => (
          <article
            className="flex flex-col gap-5 rounded-[2rem] bg-white p-5 shadow-sm shadow-slate-200/90 sm:flex-row"
            key={book.id}
          >
            <div
              className={`h-40 rounded-3xl bg-gradient-to-br ${book.cover} p-5 sm:h-auto sm:w-36 sm:shrink-0`}
            >
              <div className="flex h-full flex-col justify-between">
                <BookOpen className="text-blue-700" size={24} />
                <p className="text-lg font-semibold leading-6 text-slate-900">
                  {book.title}
                </p>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="text-sm text-slate-500">{book.author}</p>
              <h2 className="mt-1 text-xl font-semibold">{book.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                贡献：{book.contributes.join("、")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {book.contributes.map((item) => (
                  <span
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <button
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                onClick={() => onStartSession(book)}
                type="button"
              >
                从这本书训练
                <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

type FieldViewProps = {
  tasks: ApplicationTask[];
  onCompleteTask: (taskId: string) => void;
};

function FieldView({ tasks, onCompleteTask }: FieldViewProps) {
  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="应用场"
        title="知识只有被用过，才开始变成能力。"
        description="每个任务都很小，但必须进入真实场景。"
      />

      <div className="grid gap-4">
        {tasks.map((task) => (
          <article
            className="flex flex-col justify-between gap-5 rounded-[2rem] bg-white p-5 shadow-sm shadow-slate-200/90 sm:flex-row sm:items-center"
            key={task.id}
          >
            <div className="flex gap-4">
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-2xl ${
                  task.completed
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {task.completed ? <Check size={20} /> : <Target size={20} />}
              </span>
              <div>
                <h2 className="text-lg font-semibold">{task.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {task.scenario}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.points.map((point) => (
                    <span
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      key={point}
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                task.completed
                  ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  : "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
              }`}
              onClick={() => onCompleteTask(task.id)}
              type="button"
            >
              {task.completed ? "撤销完成" : "完成"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

type SessionViewProps = {
  book: Book;
  recallText: string;
  sessionStep: SessionStep;
  setRecallText: (text: string) => void;
  setSessionStep: (step: SessionStep) => void;
  onFinish: () => void;
};

function SessionView({
  book,
  recallText,
  sessionStep,
  setRecallText,
  setSessionStep,
  onFinish,
}: SessionViewProps) {
  const stepIndex = sessionSteps.findIndex((step) => step.id === sessionStep);

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="学习流程"
        title={`${book.title}：读一点，然后合上书。`}
        description="这个流程演示核心闭环：阅读、白纸回忆、反馈、复习、应用。"
      />

      <section className="rounded-[2rem] bg-white p-5 shadow-sm shadow-slate-200/90 sm:p-6">
        <div className="grid gap-3 md:grid-cols-5">
          {sessionSteps.map((step, index) => {
            const active = step.id === sessionStep;
            const done = index < stepIndex;

            return (
              <button
                className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : done
                      ? "bg-blue-50 text-blue-600"
                      : "bg-slate-50 text-slate-400"
                }`}
                key={step.id}
                onClick={() => setSessionStep(step.id)}
                type="button"
              >
                {step.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200/90">
        {sessionStep === "read" && (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className={`rounded-3xl bg-gradient-to-br ${book.cover} p-6`}>
              <div className="flex min-h-72 flex-col justify-between">
                <BookOpen className="text-blue-700" size={28} />
                <div>
                  <p className="text-sm text-slate-600">{book.author}</p>
                  <h2 className="mt-2 text-3xl font-semibold">{book.title}</h2>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
                  <Clock3 size={16} />
                  阅读 03:00
                </div>
                <p className="text-2xl font-semibold leading-10 text-slate-950">
                  {book.excerpt}
                </p>
                <p className="mt-5 text-sm leading-6 text-slate-500">
                  只读这一小段。下一步会隐藏原文，请用自己的话写出理解。
                </p>
              </div>
              <PrimaryButton onClick={() => setSessionStep("recall")}>
                合上书，开始回忆
              </PrimaryButton>
            </div>
          </div>
        )}

        {sessionStep === "recall" && (
          <div>
            <p className="text-sm font-medium text-blue-600">白纸回忆</p>
            <h2 className="mt-2 text-3xl font-semibold">不看原文，写下你记住的。</h2>
            <textarea
              className="mt-6 min-h-72 w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 p-5 text-base leading-7 outline-none transition placeholder:text-slate-400 focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100"
              onChange={(event) => setRecallText(event.target.value)}
              placeholder="例如：主动回忆不是复习后的检查，而是学习本身。困难地取回知识，会让记忆路径更稳..."
              value={recallText}
            />
            <div className="mt-5 flex justify-end">
              <PrimaryButton onClick={() => setSessionStep("feedback")}>
                提交给 AI 反馈
              </PrimaryButton>
            </div>
          </div>
        )}

        {sessionStep === "feedback" && (
          <div>
            <p className="text-sm font-medium text-blue-600">AI 反馈</p>
            <h2 className="mt-2 text-3xl font-semibold">你记住了主干，还差两个钩子。</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <FeedbackCard
                title="记住了"
                items={["主动回忆强于重复阅读", "困难回忆会加深记忆"]}
              />
              <FeedbackCard
                title="漏掉了"
                items={["测验本身也是学习", "低风险反馈更适合长期训练"]}
              />
              <FeedbackCard
                title="误解了"
                items={["不是越痛苦越好，而是难度要可承受"]}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <PrimaryButton onClick={() => setSessionStep("schedule")}>
                安排复习
              </PrimaryButton>
            </div>
          </div>
        )}

        {sessionStep === "schedule" && (
          <div>
            <p className="text-sm font-medium text-blue-600">复习安排</p>
            <h2 className="mt-2 text-3xl font-semibold">这个知识点会在遗忘前回来。</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {["明天", "3 天后", "1 周后"].map((time) => (
                <div className="rounded-3xl bg-slate-50 p-5" key={time}>
                  <Clock3 className="text-blue-600" size={22} />
                  <p className="mt-6 text-2xl font-semibold">{time}</p>
                  <p className="mt-2 text-sm text-slate-500">白纸回忆 · 低风险测验</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <PrimaryButton onClick={() => setSessionStep("apply")}>
                生成应用任务
              </PrimaryButton>
            </div>
          </div>
        )}

        {sessionStep === "apply" && (
          <div>
            <p className="text-sm font-medium text-blue-600">应用任务</p>
            <h2 className="mt-2 text-3xl font-semibold">
              用 100 字向朋友解释主动回忆。
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
              不要复述概念。用一个备考、读书或工作学习的场景，让对方知道今晚就能怎么做。
            </p>
            <div className="mt-8 rounded-3xl bg-gradient-to-br from-blue-50 to-white p-5">
              <p className="text-sm font-medium text-slate-500">现实场景</p>
              <p className="mt-2 text-xl font-semibold">
                发给一个正在准备考试的朋友，帮他把“看懂了”变成“能想起来”。
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <PrimaryButton onClick={onFinish}>进入应用场</PrimaryButton>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function FeedbackCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-500">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <Check className="mt-0.5 shrink-0 text-blue-600" size={16} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-[2rem] bg-white/80 p-6 shadow-sm shadow-slate-200/90 backdrop-blur sm:p-8">
      <p className="text-sm font-medium text-blue-600">{eyebrow}</p>
      <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
        {description}
      </p>
    </section>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
      onClick={onClick}
      type="button"
    >
      {children}
      <ArrowRight size={16} />
    </button>
  );
}

export default App;
