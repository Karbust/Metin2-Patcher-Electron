import { FunctionComponent } from 'react'

interface Props {
    bgColor: string
    completed: number
}

const ProgressBar: FunctionComponent<Props> = ({ bgColor, completed }) => {
    const containerStyles: Record<string, string | number> = {
        height: 20,
        width: '100%',
        backgroundColor: '#e0e0de',
        borderRadius: 50,
        margin: 50
    }

    const fillerStyles: Record<string, string | number> = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: bgColor,
        borderRadius: 'inherit',
        textAlign: 'right',
        transition: 'width 1s ease-in-out',
    }

    const labelStyles: Record<string, string | number> = {
        padding: 5,
        color: 'white',
        fontWeight: 'bold'
    }

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${completed}%`}</span>
            </div>
        </div>
    )
}

export default ProgressBar
