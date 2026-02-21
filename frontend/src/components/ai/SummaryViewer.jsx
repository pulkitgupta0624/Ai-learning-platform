import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SummaryViewer = ({ summary }) => {
    return (
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {summary}
            </ReactMarkdown>
        </div>
    );
};

export default SummaryViewer;