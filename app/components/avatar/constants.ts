export type Animal = {
	id: number;
	key: 'lisa' | 'panda' | 'enot' | 'sova' | 'pingvin';
	ru: string;
	gender: 'm' | 'f';
};

export type Adjective = {
	masc: string;
	fem: string;
};

export const animals: Animal[] = [
	{ id: 1, key: 'lisa', ru: 'лиса', gender: 'f' },
	{ id: 2, key: 'panda', ru: 'панда', gender: 'f' },
	{ id: 3, key: 'enot', ru: 'енот', gender: 'm' },
	{ id: 4, key: 'sova', ru: 'сова', gender: 'f' },
	{ id: 5, key: 'pingvin', ru: 'пингвин', gender: 'm' },
];

export const adjectives: Adjective[] = [
	{ masc: 'Любопытный', fem: 'Любопытная' },
	{ masc: 'Тихий', fem: 'Тихая' },
	{ masc: 'Умный', fem: 'Умная' },
	{ masc: 'Яркий', fem: 'Яркая' },
	{ masc: 'Проворный', fem: 'Проворная' },
	{ masc: 'Смелый', fem: 'Смелая' },
	{ masc: 'Крошечный', fem: 'Крошечная' },
	{ masc: 'Везучий', fem: 'Везучая' },
	{ masc: 'Спокойный', fem: 'Спокойная' },
	{ masc: 'Мистический', fem: 'Мистическая' },
	{ masc: 'Сонный', fem: 'Сонная' },
	{ masc: 'Благородный', fem: 'Благородная' },
	{ masc: 'Космический', fem: 'Космическая' },
	{ masc: 'Дружелюбный', fem: 'Дружелюбная' },
	{ masc: 'Храбрый', fem: 'Храбрая' },
];

export type AvatarInfo = {
	animalId: number; // 1..5
	animalRu: string;
	displayName: string;
	avatarUrl: string; // /assets/avatars/avatar{n}.png
};



