@extends('backend.layouts.app')

@section('title', __('labels.backend.reports.students_report').' | '.app_name())

@push('after-styles')
    <style>
        .dataTables_wrapper .dataTables_filter {
            float: right !important;
            text-align: left;
            margin-left: 25%;
        }

        div.dt-buttons {
            display: inline-block;
            width: 100%;
            text-align: center;
        }
        .plot-container.plotly .modebar-container{
            display: none !important;
        }

    </style>
@endpush
@section('content')
   <?php //dd($testreport);  ?>
    <div class="card">
        <div class="card-header">
            <h3 class="page-title d-inline">Test Report</h3>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped ">
                            <thead>
                            <tr>
                                <th>@lang('labels.general.sr_no')</th>
                                <th>Title</th>
                                <th>Report</th>
                                
                            </tr>
                            @php $i = 0; @endphp
                            @forelse($testreport as $report)
                                <tr>
                                    <td>{{ ++$i }}</td>
                                    <td>{{ $report->title }}</td>
                                    <?php
                                        $current_content = json_decode($report->content);
                                        //$current_content = json_decode($report->origin_content);
                                    ?>
                                    <td>{!! $current_content !!}</td>
                                </tr>
                            @empty
                                <tr><td>Sorry! No Record Found</td></tr>
                            @endforelse
                            
                            </thead>

                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

@stop

