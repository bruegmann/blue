import { HeaderTitle } from "blue-react"

export default function BreadcrumbExample() {
    return (
        <HeaderTitle
            breadcrumb={[<a href=".">Home page</a>, <a href="react/HeaderTitle">This component</a>, "Current page"]}
        />
    )
}
