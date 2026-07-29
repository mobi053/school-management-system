import { Link } from "@inertiajs/react";

export default function Breadcrumb({ items = [] }) {
    return (
        <div className="flex items-center text-sm text-gray-500 gap-2">
            {
                items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2"
                    >
                        {
                            index !== 0 && (
                                <span>/</span>
                            )
                        }
                        {
                            item.href
                                ?
                                <Link
                                    href={item.href}
                                    className="hover:text-blue-600"
                                >
                                    {item.label}
                                </Link>
                                :
                                <span className="font-medium text-gray-700">
                                    {item.label}
                                </span>
                        }
                    </div>
                ))
            }
        </div>
    );
}