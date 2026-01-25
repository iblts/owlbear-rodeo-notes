import clsx from 'clsx'
import styles from './button.module.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'circle' | 'circle-secondary'
}

export const Button = ({
	variant = 'primary',
	className,
	children,
	...props
}: ButtonProps) => {
	return (
		<button
			className={clsx(styles.button, styles[variant], className)}
			{...props}
		>
			{children}
		</button>
	)
}
