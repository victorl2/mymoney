import strawberry
from strawberry.types import Info

from app.graphql.types.investment import AssetGQL, AssetType
from app.graphql.types.portfolio import PortfolioType
from app.graphql.inputs.investment import (
    CreateAssetInput,
    CreatePortfolioInput,
    UpdateAssetInput,
    UpdatePortfolioInput,
)
from app.services.investment_service import InvestmentService


def _to_asset_gql(asset) -> AssetGQL:
    svc = InvestmentService
    return AssetGQL(
        id=strawberry.ID(str(asset.id)),
        symbol=asset.symbol,
        name=asset.name,
        asset_type=AssetType(asset.asset_type),
        quantity=asset.quantity,
        purchase_price=asset.purchase_price,
        purchase_date=asset.purchase_date,
        current_price=asset.current_price,
        currency=asset.currency,
        notes=asset.notes,
        total_cost=svc.compute_asset_total_cost(asset),
        current_value=svc.compute_asset_current_value(asset),
        gain_loss=svc.compute_asset_gain_loss(asset),
        gain_loss_percent=svc.compute_asset_gain_loss_percent(asset),
        created_at=asset.created_at,
        updated_at=asset.updated_at,
    )


def _to_portfolio_type(portfolio) -> PortfolioType:
    totals = InvestmentService.compute_portfolio_totals(portfolio)
    return PortfolioType(
        id=strawberry.ID(str(portfolio.id)),
        name=portfolio.name,
        description=portfolio.description,
        assets=[_to_asset_gql(a) for a in portfolio.assets],
        total_value=totals["total_value"],
        total_cost=totals["total_cost"],
        total_gain_loss=totals["total_gain_loss"],
        total_gain_loss_percent=totals["total_gain_loss_percent"],
        created_at=portfolio.created_at,
        updated_at=portfolio.updated_at,
    )


@strawberry.type
class InvestmentQuery:
    @strawberry.field
    def portfolios(self, info: Info) -> list[PortfolioType]:
        db = info.context["db"]
        service = InvestmentService(db)
        return [_to_portfolio_type(p) for p in service.list_portfolios()]

    @strawberry.field
    def portfolio(self, info: Info, id: strawberry.ID) -> PortfolioType | None:
        db = info.context["db"]
        service = InvestmentService(db)
        p = service.get_portfolio(int(id))
        return _to_portfolio_type(p) if p else None

    @strawberry.field
    def asset(self, info: Info, id: strawberry.ID) -> AssetGQL | None:
        db = info.context["db"]
        service = InvestmentService(db)
        a = service.get_asset(int(id))
        return _to_asset_gql(a) if a else None


@strawberry.type
class InvestmentMutation:
    @strawberry.mutation
    def create_portfolio(self, info: Info, input: CreatePortfolioInput) -> PortfolioType:
        db = info.context["db"]
        service = InvestmentService(db)
        portfolio = service.create_portfolio(name=input.name, description=input.description)
        # Reload with assets
        portfolio = service.get_portfolio(portfolio.id)
        return _to_portfolio_type(portfolio)

    @strawberry.mutation
    def update_portfolio(
        self, info: Info, id: strawberry.ID, input: UpdatePortfolioInput
    ) -> PortfolioType:
        db = info.context["db"]
        service = InvestmentService(db)
        kwargs = {}
        if input.name is not None:
            kwargs["name"] = input.name
        if input.description is not None:
            kwargs["description"] = input.description
        portfolio = service.update_portfolio(int(id), **kwargs)
        if not portfolio:
            raise ValueError(f"Portfolio with id {id} not found")
        portfolio = service.get_portfolio(portfolio.id)
        return _to_portfolio_type(portfolio)

    @strawberry.mutation
    def delete_portfolio(self, info: Info, id: strawberry.ID) -> bool:
        db = info.context["db"]
        service = InvestmentService(db)
        return service.delete_portfolio(int(id))

    @strawberry.mutation
    def create_asset(self, info: Info, input: CreateAssetInput) -> AssetGQL:
        db = info.context["db"]
        service = InvestmentService(db)
        asset = service.create_asset(
            portfolio_id=int(input.portfolio_id),
            symbol=input.symbol,
            name=input.name,
            asset_type=input.asset_type.value,
            quantity=input.quantity,
            purchase_price=input.purchase_price,
            purchase_date=input.purchase_date,
            current_price=input.current_price,
            currency=input.currency,
            notes=input.notes,
        )
        return _to_asset_gql(asset)

    @strawberry.mutation
    def update_asset(self, info: Info, id: strawberry.ID, input: UpdateAssetInput) -> AssetGQL:
        db = info.context["db"]
        service = InvestmentService(db)
        kwargs = {}
        if input.symbol is not None:
            kwargs["symbol"] = input.symbol
        if input.name is not None:
            kwargs["name"] = input.name
        if input.asset_type is not None:
            kwargs["asset_type"] = input.asset_type.value
        if input.quantity is not None:
            kwargs["quantity"] = input.quantity
        if input.purchase_price is not None:
            kwargs["purchase_price"] = input.purchase_price
        if input.purchase_date is not None:
            kwargs["purchase_date"] = input.purchase_date
        if input.current_price is not None:
            kwargs["current_price"] = input.current_price
        if input.currency is not None:
            kwargs["currency"] = input.currency
        if input.notes is not None:
            kwargs["notes"] = input.notes
        asset = service.update_asset(int(id), **kwargs)
        if not asset:
            raise ValueError(f"Asset with id {id} not found")
        return _to_asset_gql(asset)

    @strawberry.mutation
    def delete_asset(self, info: Info, id: strawberry.ID) -> bool:
        db = info.context["db"]
        service = InvestmentService(db)
        return service.delete_asset(int(id))

    @strawberry.mutation
    def update_asset_price(
        self, info: Info, id: strawberry.ID, current_price: "Decimal"
    ) -> AssetGQL:
        db = info.context["db"]
        service = InvestmentService(db)
        asset = service.update_asset(int(id), current_price=current_price)
        if not asset:
            raise ValueError(f"Asset with id {id} not found")
        return _to_asset_gql(asset)


from decimal import Decimal  # noqa: E402
