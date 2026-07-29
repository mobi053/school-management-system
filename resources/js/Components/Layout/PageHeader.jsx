import Breadcrumb from "./Breadcrumb";

export default function PageHeader({
    title,
    subtitle,
    breadcrumb = [],
    action = null,
}) {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                        {title}
                    </h2>
                    {
                        subtitle &&
                        <p className="text-gray-500 mt-1">
                            {subtitle}
                        </p>
                    }
                </div>
                {action}
            </div>
            {
                breadcrumb.length > 0 &&
                <div className="mt-4">
                    <Breadcrumb items={breadcrumb} />
                </div>
            }
        </div>
    );
}