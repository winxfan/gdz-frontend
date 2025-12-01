import avatar1 from '@/assets/avatar1.webp';
import avatar2 from '@/assets/avatar2.webp';
import avatar3 from '@/assets/avatar3.webp';
import avatar4 from '@/assets/avatar4.webp';
import avatar5 from '@/assets/avatar5.webp';

const map: Record<number, string> = {
	1: (avatar1 as unknown as { src: string }).src,
	2: (avatar2 as unknown as { src: string }).src,
	3: (avatar3 as unknown as { src: string }).src,
	4: (avatar4 as unknown as { src: string }).src,
	5: (avatar5 as unknown as { src: string }).src,
};

export function avatarUrlById(id: number): string {
	return map[id] ?? map[1];
}



