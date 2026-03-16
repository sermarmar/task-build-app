export class TaskResponse {
    title: string = '';
    description: string = '';
    category: string = '';
    status: string = '';
    points: number = 0;

    //Setters
    setTitle(title: string) {
        this.title = title;
    }

    setDescription(description: string) {
        this.description = description;
    }

    setCategory(category: string) {
        this.category = category;
    }

    setStatus(status: string) {
        this.status = status;
    }

    setPoints(points: number) {
        this.points = points;
    }

    //Getters
    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getCategory() {
        return this.category;
    }

    getStatus() {
        return this.status;
    }

    getPoints() {
        return this.points;
    }
}