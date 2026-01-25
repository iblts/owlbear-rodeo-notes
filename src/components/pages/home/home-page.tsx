'use client'

import { IconCheck } from '@/components/ui/icons/Check'
import { IconEdit } from '@/components/ui/icons/Edit'
import { useDice } from '@/hooks/useDice'
import { useMemo, useState } from 'react'
import styles from './home-page.module.scss'

const DICE_REGEX = /\b\d*d\d+(?:k[hl]\d+|d[hl]\d+)?(?:[+-]\d+)?\b/gi
const METADATA_KEY = 'com.extentions.notes/metadata'

function splitDiceText(text: string) {
	const parts: Array<
		{ type: 'text'; value: string } | { type: 'dice'; value: string }
	> = []

	let lastIndex = 0
	const matches = [...text.matchAll(DICE_REGEX)]

	for (const match of matches) {
		const start = match.index ?? 0
		const full = match[0]

		if (start > lastIndex) {
			parts.push({ type: 'text', value: text.slice(lastIndex, start) })
		}

		parts.push({ type: 'dice', value: full })

		lastIndex = start + full.length
	}

	if (lastIndex < text.length) {
		parts.push({ type: 'text', value: text.slice(lastIndex) })
	}

	return parts
}

export const HomePage = () => {
	const [view, setView] = useState<'editor' | 'preview'>('preview')
	const handleRollDice = useDice()
	const [value, setValue] = useState(
		JSON.parse(localStorage.getItem(METADATA_KEY) || ''),
	)

	const previewParts = useMemo(() => splitDiceText(value), [value])

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const text = e.target.value
		setValue(text)
		localStorage.setItem(METADATA_KEY, JSON.stringify(text))
	}

	return (
		<main className={styles.main}>
			<button
				type='button'
				className={styles.toggleButton}
				onClick={() =>
					setView(prev => (prev === 'editor' ? 'preview' : 'editor'))
				}
			>
				{view === 'editor' ? <IconCheck size={16} /> : <IconEdit size={16} />}
			</button>
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
