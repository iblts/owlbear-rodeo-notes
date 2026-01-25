'use client'

import { useDice } from '@/hooks/useDice'
import { checkIsObject } from '@/utils/helpers'
import OBR from '@owlbear-rodeo/sdk'
import { useEffect, useMemo, useState } from 'react'
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
	const handleRollDice = useDice()
	const [value, setValue] = useState('')

	const previewParts = useMemo(() => splitDiceText(value), [value])

	useEffect(() => {
		const fetchMetadata = async () => {
			const metadata = await OBR.player.getMetadata()
			if (checkIsObject(metadata) && METADATA_KEY in metadata) {
				const text = metadata[METADATA_KEY]
				if (typeof text === 'string') {
					setValue(text)
				}
			}
		}
		fetchMetadata()
	}, [])

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const text = e.target.value
		setValue(text)
		OBR.player.setMetadata({ [METADATA_KEY]: text })
	}

	return (
		<main className={styles.main}>
			<textarea
				className={styles.input}
				value={value}
				onChange={handleChange}
				placeholder='Например: атака d20+5, попадание: d6+2 урона или 2d20kh1 - для броска 1к20 с преимуществом'
			/>

			<div className={styles.preview}>
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
		</main>
	)
}
