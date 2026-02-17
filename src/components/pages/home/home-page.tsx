'use client'

import { IconCheck } from '@/components/ui/icons/Check'
import { IconEdit } from '@/components/ui/icons/Edit'
import { useDice } from '@/hooks/useDice'
import { useMemo, useState } from 'react'
import styles from './home-page.module.scss'

const FORMAT_REGEX =
	/\*\*([^*]+)\*\*|__([^_]+)__|\b\d*d\d+(?:k[hl]\d+|d[hl]\d+)?(?:[+-]\d+)?\b/gi
const METADATA_KEY = 'com.extentions.notes/metadata'

type Part =
	| { type: 'text'; value: string }
	| { type: 'dice'; value: string }
	| { type: 'bold'; value: string }
	| { type: 'underline'; value: string }

function splitFormattedText(text: string): Part[] {
	const parts: Part[] = []

	let lastIndex = 0

	for (const match of text.matchAll(FORMAT_REGEX)) {
		const start = match.index ?? 0
		const full = match[0]

		if (start > lastIndex) {
			parts.push({
				type: 'text',
				value: text.slice(lastIndex, start),
			})
		}

		if (full.startsWith('**')) {
			parts.push({
				type: 'bold',
				value: match[1],
			})
		} else if (full.startsWith('__')) {
			parts.push({
				type: 'underline',
				value: match[2],
			})
		} else {
			parts.push({
				type: 'dice',
				value: full,
			})
		}

		lastIndex = start + full.length
	}

	if (lastIndex < text.length) {
		parts.push({
			type: 'text',
			value: text.slice(lastIndex),
		})
	}

	return parts
}

export const HomePage = () => {
	const [view, setView] = useState<'editor' | 'preview'>('preview')
	const handleRollDice = useDice()
	const [value, setValue] = useState(localStorage.getItem(METADATA_KEY) || '')

	const previewParts = useMemo(() => splitFormattedText(value), [value])

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const text = e.target.value
		setValue(text)
		localStorage.setItem(METADATA_KEY, text)
	}

	return (
		<main className={styles.main}>
			<header className={styles.header}>
				<p className={styles.title}>Заметки</p>
				<button
					type='button'
					className={styles.toggleButton}
					onClick={() =>
						setView(prev => (prev === 'editor' ? 'preview' : 'editor'))
					}
				>
					{view === 'editor' ? (
						<IconCheck size={16} fill='#fff' />
					) : (
						<IconEdit size={16} fill='#fff' />
					)}
				</button>
			</header>
			{view === 'editor' && (
				<textarea
					className={styles.input}
					value={value}
					onChange={handleChange}
					placeholder='Например: атака d20+5, попадание: d6+2 урона или 2d20kh1 - для броска 1к20 с преимуществом'
				/>
			)}

			{view === 'preview' && (
				<div className={styles.preview} onDoubleClick={() => setView('editor')}>
					{previewParts.map((part, idx) => {
						if (part.type === 'text') return <span key={idx}>{part.value}</span>

						if (part.type === 'bold')
							return <strong key={idx}>{part.value}</strong>

						if (part.type === 'underline')
							return (
								<span key={idx} className={styles.underline}>
									{part.value}
								</span>
							)

						if (part.type === 'dice')
							return (
								<button
									key={idx}
									type='button'
									className={styles.dice}
									onClick={() => handleRollDice(part.value)}
								>
									{part.value}
								</button>
							)
					})}
				</div>
			)}
		</main>
	)
}
