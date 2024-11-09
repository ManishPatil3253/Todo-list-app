import { useCallback, useEffect, useState } from 'react';
import { AddItemForm } from './AddNewItemForm';
import { ItemDisplay } from './ItemDisplay';

export function TodoListCard() {
    const [items, setItems] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/items')
            .then((r) => r.json())
            .then(setItems);
    }, []);

    const onNewItem = useCallback(
        (newItem) => {
            if (items.length >= 5) {
                setError('You can only add up to 5 items.');
                return;
            }
            setItems([...items, newItem]);
            setError(null); // Clear any previous error
        },
        [items],
    );

    const onItemUpdate = useCallback(
        (item) => {
            const index = items.findIndex((i) => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = useCallback(
        (item) => {
            const index = items.findIndex((i) => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
            setError(null); // Clear error in case items go below 5
        },
        [items],
    );

    if (items === null) return 'Loading...';

    return (
        <>
            <AddItemForm onNewItem={onNewItem} />
            {error && <p className="error-message">{error}</p>}
            {items.length === 0 && (
                <p className="text-center">No items yet! Add one above!</p>
            )}
            {items.map((item) => (
                <ItemDisplay
                    key={item.id}
                    item={item}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </>
    );
}
