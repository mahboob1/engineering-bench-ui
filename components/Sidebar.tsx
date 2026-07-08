"use client";

type Props = {
    selected: string;
    onSelect: (panel: string) => void;
};

export default function Sidebar({
    selected,
    onSelect
}: Props) {

    const items = [
        "Chat",
        "Collections",
        "Upload",
        "GitHub",
        "Settings"
    ];

    return (

        <div
            style={{
                width: 220,
                borderRight: "1px solid #ddd",
                padding: 20
            }}
        >

            <h2>Engineering Bench</h2>

            {items.map(item => (

                <button
                    key={item}
                    onClick={() => onSelect(item)}
                    style={{
                        display: "block",
                        width: "100%",
                        marginTop: 10,
                        padding: 10,
                        fontWeight:
                            selected === item
                                ? "bold"
                                : "normal"
                    }}
                >
                    {item}
                </button>

            ))}

        </div>

    );

}