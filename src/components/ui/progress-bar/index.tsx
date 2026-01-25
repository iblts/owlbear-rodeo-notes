import styles from './progress-bar.module.scss'

export const ProgressBar = ({
	current,
	total,
}: {
	current: number
	total: number
}) => {
	return (
		<div className={styles.bar}>
			<div
				className={styles.progress}
				style={{ width: `${(current / total) * 100}%` }}
			/>
		</div>
	)
}
