import { checkIsObject } from '@/utils/helpers'
import OBR from '@owlbear-rodeo/sdk'

const MY_EXTENSION_ID = 'owlbear-rodeo-notes'

export const useDice = () => {
	const handleRollDice = async (diceNotation = '2d20kh1+5') => {
		const rollId = `roll_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

		await OBR.broadcast.sendMessage(
			'dice-plus/roll-request',
			{
				rollId,
				playerId: await OBR.player.getId(),
				playerName: await OBR.player.getName(),
				rollTarget: 'everyone',
				diceNotation,
				showResults: true,
				timestamp: Date.now(),
				source: MY_EXTENSION_ID,
			},
			{ destination: 'ALL' },
		)

		OBR.broadcast.onMessage(`${MY_EXTENSION_ID}/roll-result`, event => {
			const result = event.data
			// Handle your roll result
			if (checkIsObject(result) && result.rollId === rollId) {
				if (checkIsObject(result.result) && 'totalValue' in result.result) {
					console.log('Roll complete:', result.result.totalValue)
				}
			}
		})

		// Listen for errors on YOUR extension's channel
		OBR.broadcast.onMessage(`${MY_EXTENSION_ID}/roll-error`, event => {
			const error = event.data
			if (checkIsObject(error) && error.rollId === rollId) {
				console.error('Roll failed:', error.error)
			}
		})
	}

	return handleRollDice
}
