@extends(config('chatter.master_file_extend'))

@section('content')
@if(config('chatter.errors'))
<section class="alerts">
	@if(Session::has('chatter_alert'))
		<div class="chatter-alert alert alert-dismissible alert-{{ Session::get('chatter_alert_type') }} rounded-0 font-weight-bold" role="alert">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<strong><i class="chatter-alert-{{ Session::get('chatter_alert_type') }}"></i> {{ config('chatter.alert_messages.' . Session::get('chatter_alert_type')) }}</strong>
						{{ Session::get('chatter_alert') }}
					</div>
				</div>
			</div>
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<i class="chatter-close fas fa-times-circle"></i>
			</button>
		</div>
		<div class="chatter-alert-spacer"></div>
	@endif

	@if (count($errors) > 0)
		<div class="chatter-alert alert alert-dismissible alert-danger rounded-0 font-weight-bold" role="alert">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<p><strong><i class="chatter-alert-danger"></i> @lang('chatter::alert.danger.title')</strong> @lang('chatter::alert.danger.reason.errors')</p>
						<ul>
							@foreach ($errors->all() as $error)
								<li>{{ $error }}</li>
							@endforeach
						</ul>
					</div>
				</div>
			</div>
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<i class="chatter-close fas fa-times-circle"></i>
			</button>
		</div>
	@endif
</section>
@endif

<section class="bg-darker forum text-break pt-5">
	<div class="container">
		<div class="row">
			<!-- Sidebar -->
			<div class="col-lg-3 mb-3">
				<!-- New Discussion Button -->
				<button class="btn btn-block btn-primary mb-3" id="new_discussion_btn"><i class="fas fa-plus-circle"></i> @lang('chatter::messages.discussion.new')</button>

				<!-- All Discussions Button -->
				<a href="/{{ config('chatter.routes.home') }}"><i class="chatter-bubble"></i> @lang('chatter::messages.discussion.all')</a>

				<!-- Category Filter Nav -->
				<div class="category-nav">
					{!! $categoriesMenu !!}
				</div>
			</div>
			<!-- /Sidebar -->

			<!-- Discussions -->
			<div class="col-lg-9 discussions">
				@foreach($discussions as $discussion)
				<div class="row discussion mb-3">
					<!-- Left -->
					<div class="left col-12 col-sm-2 py-3">
						<div class="avatar">
							@if(config('chatter.user.avatar_image_database_field'))
								<!-- If the user db field contains http:// or https:// we don't need to use the relative path to the image assets -->
								@if( (substr($discussion->user->getAttribute(config('chatter.user.avatar_image_database_field')), 0, 7) == 'http://') || (substr($discussion->user->getAttribute(config('chatter.user.avatar_image_database_field')), 0, 8) == 'https://') )
								<img src="{{ $discussion->user->getAttribute(config('chatter.user.avatar_image_database_field'))  }}" class="img-fluid d-block mx-auto rounded">
								@else
								<img src="{{ config('chatter.user.relative_url_to_image_assets') . $discussion->user->getAttribute(config('chatter.user.avatar_image_database_field'))  }}" class="img-fluid d-block mx-auto rounded">
								@endif
							@else
								<p class="text-center lead">
									<span class="p-2 chatter_avatar_circle" style="background-color:#{{ \SkyRaptor\Chatter\Helpers\ChatterHelper::stringToColorCode($discussion->user->getAttribute(config('chatter.user.database_field_with_user_name'))) }}">
										{{ strtoupper(substr($discussion->user->getAttribute(config('chatter.user.database_field_with_user_name')), 0, 1)) }}
									</span>
								</p>
							@endif
						</div>
					</div>
					<!-- /Left -->

					<!-- Right -->
					<div class="right col-12 col-sm-10 py-3">
						<div class="d-flex flex-column flex-grow-1 h-100">
							<!-- Post Title -->
							<div class="title d-flex flex-column flex-sm-row align-items-center mb-2">
								<a class="d-block w-100 text-center text-sm-left" href="/{{ config('chatter.routes.home') }}/{{ config('chatter.routes.discussion') }}/{{ $discussion->category->slug }}/{{ $discussion->slug }}">
									<h3 class="flex-grow-1 mb-0">{{ $discussion->title }}</h3>
								</a>
								<span class="category badge text-white p-2" style="background-color:{{ $discussion->category->color }}">{{ $discussion->category->name }}</span>
							</div>

							<!-- Post Details -->
							<div class="details text-center text-sm-left text-softwhite mb-2">
								<a href="{{ \SkyRaptor\Chatter\Helpers\ChatterHelper::userLink($discussion->user) }}">{{ ucfirst($discussion->user->{config('chatter.user.database_field_with_user_name')}) }}</a> <span class="ago">{{ \Carbon\Carbon::createFromTimeStamp(strtotime($discussion->created_at))->diffForHumans() }}</span>
							</div>

							<!-- Content -->
							<div class="content d-flex flex-row flex-grow-1">
								<!-- Post Content -->
								<div class="main text-white">
									<div class="body text-break">
										{{ substr(strip_tags($discussion->post[0]->body), 0, 200) }}@if(strlen(strip_tags($discussion->post[0]->body)) > 200){{ '...' }}@endif
									</div>
								</div>
								<div class="p-3 text-primary text-center">
									<i class="fas fa-comments"></i>
									<div class="answer_count">{{ $discussion->postsCount[0]->total }}</div>
								</div>
							</div>
							<!-- /Content -->
						</div>
					</div>
					<!-- /Right -->
				</div>
				@endforeach

				<!-- Pagination -->
				<div class="row">
					<div class="col d-flex justify-content-center">
						{{ $discussions->links() }}
					</div>
				</div>
			</div>
			<!-- /Discussions -->
		</div>
	</div>
</section>

<div id="new-discussion" class="fixed-bottom" style="display:none;">
	<div class="container bg-dark mh-50 overflow-auto pt-3 pb-3">
		<div class="d-none">
			<div id="new_discussion_loader"></div>
			<label id="tinymce_placeholder">@lang('chatter::messages.editor.tinymce_placeholder')</label>
		</div>

		<form id="chatter_form_editor" action="/{{ config('chatter.routes.home') }}/{{ config('chatter.routes.discussion') }}" method="POST">
			<div class="row mb-3 align-items-center">
				<div class="col-md-2 mb-3 mb-md-0 order-md-3">
					<button class="btn btn-block btn-danger cancel-discussion fas fa-times-circle" type="button"></button>
				</div>

				<div class="col-md-6 mb-3 mb-md-0">
					<!-- TITLE -->
					<input type="text" class="form-control" id="title" name="title" placeholder="@lang('chatter::messages.editor.title')" value="{{ old('title') }}" >
				</div>

				<div class="col-md-4 mb-3 mb-md-0">
					<!-- CATEGORY -->
					<select id="chatter_category_id" class="form-control" name="chatter_category_id">
						<option value="">@lang('chatter::messages.editor.select')</option>
						@foreach($categories as $category)
							@if(old('chatter_category_id') == $category->id)
								<option value="{{ $category->id }}" selected>{{ $category->name }}</option>
							@elseif(!empty($current_category_id) && $current_category_id == $category->id)
								<option value="{{ $category->id }}" selected>{{ $category->name }}</option>
							@else
								<option value="{{ $category->id }}">{{ $category->name }}</option>
							@endif
						@endforeach
					</select>
				</div>
			</div><!-- .row -->

			<!-- BODY -->
			<div class="row mb-3">
				<div class="col-12">
					<textarea id="body" class="richText" name="body" placeholder="">{{ old('body') }}</textarea>
				</div>
			</div>

			<input type="hidden" name="_token" id="csrf_token_field" value="{{ csrf_token() }}">

			<div class="row">
				<div class="col-12">
					<button class="btn btn-secondary cancel-discussion" type="button">@lang('chatter::messages.words.cancel')</button>
					<button id="submit_discussion" class="btn btn-success float-right" type="submit"><i class="fas fa-plus-circle"></i> @lang('chatter::messages.discussion.create')</button>
					<div class="clearfix"></div>
				</div>
			</div>
		</form>
	</div>
</div>

<input type="hidden" id="chatter_tinymce_toolbar" value="{{ config('chatter.tinymce.toolbar') }}">
<input type="hidden" id="chatter_tinymce_plugins" value="{{ config('chatter.tinymce.plugins') }}">
<input type="hidden" id="current_path" value="{{ Request::path() }}">
@endsection

@section(config('chatter.yields.header'))
<link href="{{ url('/vendor/SkyRaptor/chatter/assets/css/chatter.css') }}" rel="stylesheet">
@endsection

@section(config('chatter.yields.footer'))
<script src="{{ url('/vendor/SkyRaptor/chatter/assets/js/chatter-home.js') }}"></script>
<script>
	$('document').ready(function(){
		for (const element of document.querySelectorAll('.cancel-discussion')) {
			element.addEventListener('click', event => {
				$('#new-discussion').slideUp();
			});
		}

		document.querySelector('#new_discussion_btn').addEventListener('click', event => {
			@guest
				window.location.href = "{{ route(config('chatter.routes.login')) }}";
			@endguest
			@auth
				$('#new-discussion').slideDown();
				$('#title').focus();
			@endauth
		});

		@if (count($errors) > 0)
			$('#new-discussion').slideDown();
			$('#title').focus();
		@endif

	});
</script>
@endsection