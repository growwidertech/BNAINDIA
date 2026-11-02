import backup from "../../prisma/backup-data.json";

type BackupCategory = (typeof backup.categories)[number];
type BackupArticle = (typeof backup.articles)[number];
type BackupUser = (typeof backup.users)[number];
type BackupTranslation = (typeof backup.articleTranslations)[number];

const categories = [...backup.categories].sort((a, b) => a.order - b.order);
const usersById = new Map(backup.users.map((user) => [user.id, user]));
const categoriesById = new Map(categories.map((category) => [category.id, category]));
const categoriesBySlug = new Map(categories.map((category) => [category.slug, category]));
const translations = backup.articleTranslations as BackupTranslation[];

function applyTranslation(article: BackupArticle, lang: string) {
  const trans = translations.find(
    (item) => item.articleId === article.id && item.language === lang && item.status === "PUBLISHED"
  );
  return {
    ...article,
    title: trans?.title || article.title,
    summary: trans?.summary || article.summary,
    content: trans?.content || article.content,
    translations: trans ? [trans] : [],
  };
}

function withRelations(article: BackupArticle, lang: string) {
  const localized = applyTranslation(article, lang);
  const category = categoriesById.get(article.categoryId);
  const author = usersById.get(article.authorId);
  return {
    ...localized,
    category: category
      ? {
          id: category.id,
          name: category.name,
          slug: category.slug,
          color: category.color,
          description: category.description,
        }
      : { id: "", name: "News", slug: "world", color: "#b91c1c", description: "" },
    author: author
      ? {
          id: author.id,
          name: author.name,
          role: author.role,
          avatarUrl: author.avatarUrl,
          bio: author.bio,
        }
      : { id: "", name: "BNA Desk", role: "EDITOR", avatarUrl: null, bio: null },
    comments: [] as never[],
  };
}

export function getNavCategories() {
  return categories
    .filter((category) => category.isNav)
    .map((category) => ({ id: category.id, name: category.name, slug: category.slug }));
}

export function getAllCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string): BackupCategory | undefined {
  return categoriesBySlug.get(slug);
}

export function getPublishedArticles(lang: string) {
  return backup.articles
    .filter((article) => article.status === "PUBLISHED")
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
    .map((article) => withRelations(article, lang));
}

export function getBreakingArticles(lang: string) {
  return getPublishedArticles(lang)
    .filter((article) => article.isBreaking)
    .slice(0, 5)
    .map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: { slug: article.category.slug },
    }));
}

export function getArticleBySlug(slug: string, lang: string) {
  const article = backup.articles.find((item) => item.slug === slug || item.id === slug);
  if (!article) return null;
  return withRelations(article, lang);
}

export function getRelatedArticles(categoryId: string, articleId: string, lang: string) {
  return getPublishedArticles(lang)
    .filter((article) => article.categoryId === categoryId && article.id !== articleId)
    .slice(0, 3);
}

export function getCategoriesWithArticles(lang: string) {
  const articles = getPublishedArticles(lang);
  return categories.slice(0, 8).map((category) => ({
    ...category,
    articles: articles
      .filter((article) => article.categoryId === category.id)
      .slice(0, 1)
      .map((article) => ({
        id: article.id,
        title: article.title,
        summary: article.summary,
        slug: article.slug,
        featuredImage: article.featuredImage,
      })),
  }));
}

export function getVideoArticles(lang: string) {
  return getPublishedArticles(lang).filter((article) => Boolean(article.videoUrl));
}

export function searchArticles(lang: string, query: string, categorySlug: string, sortBy: string) {
  const needle = query.trim().toLowerCase();
  let articles = getPublishedArticles(lang);
  if (categorySlug) {
    articles = articles.filter((article) => article.category.slug === categorySlug);
  }
  if (needle) {
    articles = articles.filter((article) =>
      `${article.title} ${article.summary} ${article.content}`.toLowerCase().includes(needle)
    );
  }
  if (sortBy === "views") {
    articles = [...articles].sort((a, b) => b.viewsCount - a.viewsCount);
  }
  return articles.slice(0, 30);
}

export type ContentArticle = ReturnType<typeof withRelations>;
export type { BackupUser };
