import { redirect } from 'next/navigation';

export default function ProfilePage({ searchParams }: { searchParams: { userId?: string } }) {
	// На данный момент страница профиля редиректит на главную.
	// Параметр userId доступен в searchParams.userId при необходимости.
	redirect('/');
}


