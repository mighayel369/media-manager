
import { Model, HydratedDocument } from "mongoose";

export abstract class BaseRepository<TDocument, TResponse> {
    protected constructor(
        protected readonly model: Model<TDocument>
    ) { }

    protected abstract toDTO(doc: HydratedDocument<TDocument>): TResponse;

    protected toDTOList(docs: HydratedDocument<TDocument>[]): TResponse[] {
        return docs.map(doc => this.toDTO(doc));
    }

    async findById(id: string): Promise<TResponse | null> {
        const doc = await this.model.findById(id).exec();

        return doc ? this.toDTO(doc) : null;
    }

    async updateById(id: string, update: Partial<TDocument>): Promise<TResponse | null> {

        const doc = await this.model.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true }
        ).exec();

        return doc ? this.toDTO(doc) : null;
    }

    async deleteById(id: string): Promise<boolean> {

        const deleted = await this.model.findByIdAndDelete(id);

        return !!deleted;
    }
}