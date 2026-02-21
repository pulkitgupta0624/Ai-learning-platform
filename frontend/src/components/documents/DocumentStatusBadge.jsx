import React from 'react'
import Badge from '../ui/Badge'

const DocumentStatusBadge = ({ status }) => {
    const map = {
        processing: { variant: 'processing', label: 'Processing...' },
        ready: { variant: 'ready', label: 'Ready' },
        failed: { variant: 'failed', label: 'Failed' },
    };
    const { variant, label } = map[status] || { variant: 'default', label: status };
    return <Badge variant={variant}>{label}</Badge>;
};

export default DocumentStatusBadge;