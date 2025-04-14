import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RoleCard({role,value,Icon,color}:{role:string,value:number,Icon:React.ComponentType<{className?: string}> ,color:string }){
    return(
        <Card>
            <CardHeader>
                <CardTitle>{role}</CardTitle>
                <CardDescription>{value}</CardDescription>
            </CardHeader>
            <CardContent>
                <Icon className={`h-10 w-10 text-${color}-500`} />
            </CardContent>
        </Card>
    )
}