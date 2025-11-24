import avatar1 from '@/assets/avatar1.png';
import avatar2 from '@/assets/avatar2.png';
import avatar3 from '@/assets/avatar3.png';
import avatar4 from '@/assets/avatar4.png';
import avatar5 from '@/assets/avatar5.png';

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


