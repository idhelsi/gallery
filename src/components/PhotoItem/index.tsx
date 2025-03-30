import * as  C from './styles'

type Props = {
    url: string
    name: string
    onClick: (name: string) => void
}

export const PhotoItem = ({ url, name, onClick }: Props) => {
    return (
        <C.Container>
            <img src={url} alt={name} />
            {name}
            <div onClick={() => onClick(name)}>🗑️</div>
        </C.Container>
    )
}