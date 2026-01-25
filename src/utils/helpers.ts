import OBR from '@owlbear-rodeo/sdk'

export const checkDicePlusReady = async (): Promise<boolean> => {
	const requestId = crypto.randomUUID()

	return new Promise(resolve => {
		const unsubscribe = OBR.broadcast.onMessage('dice-plus/isReady', event => {
			const data = event.data

			// Check if this is a response (not a request)
			if (
				data &&
				typeof data === 'object' &&
				'ready' in data &&
				'requestId' in data &&
				data.requestId === requestId
			) {
				unsubscribe()
				resolve(true)
			}
		})

		// Send ready check request
		OBR.broadcast.sendMessage(
			'dice-plus/isReady',
			{
				requestId,
				timestamp: Date.now(),
			},
			{ destination: 'ALL' },
		)

		setTimeout(() => {
			unsubscribe()
			resolve(false)
		}, 1000)
	})
}

export const checkIsObject = (
	value: unknown,
): value is Record<string, unknown> => {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
}
